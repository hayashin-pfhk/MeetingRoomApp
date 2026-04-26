<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\StoreStaffRequest;
use App\Http\Requests\Staff\UpdateStaffRequest;
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
}
