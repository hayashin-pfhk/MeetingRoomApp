<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reservation\StoreReservationRequest;
use App\Http\Requests\Reservation\UpdateReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

/**
 * 予約 API
 */
class ReservationController extends Controller
{
    // 一覧取得（room / staffs 含む）
    public function index(): AnonymousResourceCollection
    {
        $reservations = Reservation::with(['room', 'staffs'])
            ->orderBy('start_time')
            ->get();

        return ReservationResource::collection($reservations);
    }

    // 新規作成
    public function store(StoreReservationRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $staffIds  = $validated['staff_ids'];
        unset($validated['staff_ids']);

        // 予約本体と中間テーブル登録をトランザクションで一貫させる
        $reservation = DB::transaction(function () use ($validated, $staffIds) {
            $reservation = Reservation::create($validated);
            $reservation->staffs()->sync($staffIds);
            return $reservation;
        });

        $reservation->load(['room', 'staffs']);

        return (new ReservationResource($reservation))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    // 単一取得
    public function show(Reservation $reservation): ReservationResource
    {
        $reservation->load(['room', 'staffs']);

        return new ReservationResource($reservation);
    }

    // 更新
    public function update(UpdateReservationRequest $request, Reservation $reservation): ReservationResource
    {
        $validated = $request->validated();
        $staffIds  = $validated['staff_ids'];
        unset($validated['staff_ids']);

        DB::transaction(function () use ($reservation, $validated, $staffIds) {
            $reservation->update($validated);
            $reservation->staffs()->sync($staffIds);
        });

        $reservation->load(['room', 'staffs']);

        return new ReservationResource($reservation);
    }

    // 削除（中間テーブルは外部キーの cascadeOnDelete で自動削除される）
    public function destroy(Reservation $reservation): Response
    {
        $reservation->delete();

        return response()->noContent();
    }
}
