<template>
  <div>
    <div class="col-md-4 mb-4">
      <div class="card border-0 shadow-sm">
        <div style="height: 150px; background-size: cover; background-position: center"></div>
        <div class="card-body">
          <span class="badge badge-secondary float-right ml-2">分類</span>
          <h5 class="card-title">
            <a href="#" class="text-dark">標題</a>
          </h5>
          <p class="card-text">內容</p>
          <div class="d-flex justify-content-between align-items-baseline">
            <!-- <div class="h5">2,800 元</div> -->
            <del class="h6">原價 2,800 元</del>
            <div class="h5">現在只要 1,400 元</div>
          </div>
        </div>
        <div class="card-footer d-flex">
          <button type="button" class="btn btn-outline-secondary btn-sm">
            <i class="fas fa-spinner fa-spin"></i>
            查看更多
          </button>
          <button type="button" class="btn btn-outline-danger btn-sm ml-auto">
            <i class="fas fa-spinner fa-spin"></i>
            加到購物車
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

