<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Room\StoreRoomRequest;
use App\Http\Requests\Room\UpdateRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/**
 * 会議室 API
 */
class RoomController extends Controller
{
    /**
     * 一覧取得
     */
    public function index(): AnonymousResourceCollection
    {
        $rooms = Room::orderBy('id')->get();

        return RoomResource::collection($rooms);
    }

    /**
     * 新規作成
     */
    public function store(StoreRoomRequest $request): JsonResponse
    {
        $room = Room::create($request->validated());

        return (new RoomResource($room))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * 単一取得
     * （ルートモデルバインディングで 存在しなければ自動 404）
     */
    public function show(Room $room): RoomResource
    {
        return new RoomResource($room);
    }

    /**
     * 更新
     */
    public function update(UpdateRoomRequest $request, Room $room): RoomResource
    {
        $room->update($request->validated());

        return new RoomResource($room);
    }

    /**
     * 削除
     */
    public function destroy(Room $room): Response
    {
        $room->delete();

        return response()->noContent();
    }
}
