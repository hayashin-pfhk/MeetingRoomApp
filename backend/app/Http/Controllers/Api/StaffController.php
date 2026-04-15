<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\StaffAvailabilityRequest;
use App\Http\Requests\Staff\StoreStaffRequest;
use App\Http\Requests\Staff\UpdateStaffRequest;
use App\Http\Resources\StaffAvailabilityResource;
use App\Http\Resources\StaffResource;
use App\Models\Staff;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/**
 * スタッフ API
 */
class StaffController extends Controller
{
    // 一覧取得
    public function index(): AnonymousResourceCollection
    {
        $staffs = Staff::orderBy('id')->get();

        return StaffResource::collection($staffs);
    }

    // 新規作成
    public function store(StoreStaffRequest $request): JsonResponse
    {
        $staff = Staff::create($request->validated());

        return (new StaffResource($staff))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    // 単一取得（ルートモデルバインディングで 存在しなければ自動 404）
    public function show(Staff $staff): StaffResource
    {
        return new StaffResource($staff);
    }

    // 更新
    public function update(UpdateStaffRequest $request, Staff $staff): StaffResource
    {
        $staff->update($request->validated());

        return new StaffResource($staff);
    }

    // 削除
    public function destroy(Staff $staff): Response
    {
        $staff->delete();

        return response()->noContent();
    }

    // 空き状況一覧（指定した時間帯における各スタッフの空き/予定状態を返す）
    public function availability(StaffAvailabilityRequest $request): AnonymousResourceCollection
    {
        $validated  = $request->validated();
        $startTime  = $validated['start_time'];
        $endTime    = $validated['end_time'];
        $excludeId  = $validated['exclude_reservation_id'] ?? null;

        // 各スタッフについて、指定時間帯に重複する予約だけを Eager Load する
        // パターンB（end_time exclusive）: existing.start < new.end AND existing.end > new.start
        $staffs = Staff::with(['reservations' => function ($query) use ($startTime, $endTime, $excludeId) {
            $query->where('start_time', '<', $endTime)
                  ->where('end_time', '>', $startTime)
                  ->with('room');

            if ($excludeId !== null) {
                $query->where('reservations.id', '!=', $excludeId);
            }
        }])
            ->orderBy('id')
            ->get();

        return StaffAvailabilityResource::collection($staffs);
    }
}
