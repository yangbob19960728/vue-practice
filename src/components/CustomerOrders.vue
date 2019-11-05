<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row">
      <div class="col-md-4 mb-4" v-for="product in productsList" :key="product.id">
        <div class="card border-0 shadow-sm">
          <div
            style="height: 200px; background-size: cover; background-position: center"
            :style="{backgroundImage:`url(${product.imageUrl})`}"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{product.category}}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{product.title}}</a>
            </h5>
            <p class="card-text">{{product.content}}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!product.price">{{product.origin_price}}</div>
              <del class="h6" v-if="product.price">{{product.origin_price}}</del>
              <div class="h5" v-if="product.price">現在只要{{product.price}}元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="getProduct(product.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="product.id == status.loadingItem"></i>
              查看更多
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click="addToCart(product.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ modalProduct.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="modalProduct.imageUrl" class="img-fluid" alt />
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ modalProduct.content }}</p>
              <footer class="blockquote-footer text-right">{{ modalProduct.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!modalProduct.price">{{ modalProduct.origin_price }} 元</div>
              <del class="h6" v-if="modalProduct.price">原價 {{ modalProduct.origin_price }} 元</del>
              <div class="h4" v-if="modalProduct.price">現在只要 {{ modalProduct.price }} 元</div>
            </div>
            <select name class="form-control mt-3" v-model="modalProduct.num">
              <option :value="num" v-for="num in 8" :key="num">選購 {{num}} {{modalProduct.unit}}</option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{ modalProduct.num * modalProduct.price}}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="addToCart(modalProduct.id, modalProduct.num)"
            >
              <i class="fas fa-spinner fa-spin" v-if="modalProduct.id === status.loadingItem"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class v-if="cartProducts.final_total && cartProducts.carts.length > 0">
      <table class="table">
        <thead>
          <th></th>
          <th>品名</th>
          <th>數量</th>
          <th>單價</th>
        </thead>
        <tbody>
          <tr v-for="item in cartProducts.carts" :key="item.id">
            <td class="align-middle">
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click.prevent="removeCartItem(item.id)"
              >
                <i class="far fa-trash-alt"></i>
              </button>
            </td>
            <td class="align-middle">
              {{ item.product.title }}
              <!-- <div class="text-success" v-if="item.coupon">
          已套用優惠券
              </div>-->
            </td>
            <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
            <td class="align-middle text-right">{{ item.final_total }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-right">總計</td>
            <td class="text-right">{{ cartProducts.total }}</td>
          </tr>
          <tr v-if="cartProducts.total !== cartProducts.final_total">
            <td colspan="3" class="text-right text-success">折扣價</td>
            <td class="text-right text-success">{{ cartProducts.final_total }}</td>
          </tr>
        </tfoot>
      </table>
      <div class="input-group mb-3 input-group-sm">
        <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code" />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click.prevent="addCouponCode"
          >套用優惠碼</button>
        </div>
      </div>
    </div>
    <div class="my-5 row justify-content-center">
      <form class="col-md-6" @submit.prevent="createOrder">
        <div class="form-group">
          <label for="useremail">Email</label>
          <input
            type="email"
            class="form-control"
            name="email"
            id="useremail"
            v-model="form.user.email"
            placeholder="請輸入 Email"
            required
          />
          <span class="text-danger"></span>
        </div>

        <div class="form-group">
          <label for="username">收件人姓名</label>
          <input
            type="text"
            class="form-control"
            name="name"
            id="username"
            v-model="form.user.name"
            placeholder="輸入姓名"
          />
          <span class="text-danger"></span>
        </div>

        <div class="form-group">
          <label for="usertel">收件人電話</label>
          <input
            type="tel"
            class="form-control"
            id="usertel"
            v-model="form.user.tel"
            placeholder="請輸入電話"
          />
        </div>

        <div class="form-group">
          <label for="useraddress">收件人地址</label>
          <input
            type="text"
            class="form-control"
            name="address"
            id="useraddress"
            v-model="form.user.address"
            placeholder="請輸入地址"
            
          />
          <span class="text-danger">地址欄位不得留空</span>
        </div>

        <div class="form-group">
          <label for="comment">留言</label>
          <textarea
            name
            id="comment"
            class="form-control"
            cols="30"
            rows="10"
            v-model="form.message"
          ></textarea>
        </div>
        <div class="text-right">
          <button class="btn btn-danger" >送出訂單</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
export default {
  data() {
    return {
      productsList: [],
      pagination: {},
      isLoading: false,
      modalProduct: {},
      status: {
        loadingItem: ""
      },
      cartProducts: [],
      coupon_code: "",
      form:{
        "user": {
          "name": "",
          "email": "",
          "tel": "",
          "address": ""
        },
        "message":"",
      }
    };
  },
  methods: {
    getProductList(page = 1) {
      const api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_CUSTOMPATH}/products?page=${page}`;
      this.isLoading = true;
      const _this = this;
      this.$http.get(api).then(response => {
        _this.productsList = response.data.products;
        _this.pagination = response.data.pagination;
        _this.isLoading = false;
      });
    },
    getProduct(id) {
      const api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
      this.status.loadingItem = id;
      const _this = this;
      this.$http.get(api).then(response => {
        _this.modalProduct = response.data.product;
        _this.$set(_this.modalProduct, "num", 1);
        console.log(response.data.product);
        $("#productModal").modal("show");
        _this.status.loadingItem = "";
      });
    },
    addToCart(id, qty = 1) {
      const api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      this.status.loadingItem = id;
      let data = {
        product_id: id,
        qty
      };
      const _this = this;
      this.$http.post(api, { data: data }).then(response => {
        // _this.modalProduct = response.data.product;
        console.log(response);
        _this.getCart();
        $("#productModal").modal("hide");
        _this.status.loadingItem = "";
      });
    },
    getCart() {
      const api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      const _this = this;
      this.$http.get(api).then(response => {
        _this.cartProducts = response.data.data;
        console.log(_this.cartProducts);
      });
    },
    removeCartItem(id) {
      const api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
      const _this = this;
      this.$http.delete(api).then(response => {
        // _this.cartProducts = response.data.data;
        console.log(response);
        this.getCart();
      });
    },
    addCouponCode() {
      const api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
      const _this = this;
      const coupon = {
        code: _this.coupon_code
      };
      this.$http.post(api, { data: coupon }).then(response => {
        // _this.cartProducts = response.data.data;
        console.log(response);
        this.getCart();
      });
    },
    createOrder(){
       const api = `${process.env.VUE_APP_APIPATH}api/${process.env.VUE_APP_CUSTOMPATH}/order`;
      const _this = this;
      this.$http.post(api, { data: _this.form }).then(response => {
        // _this.cartProducts = response.data.data;
        if(response.data.success){
          _this.$router.push(`customer_checkout/${response.data.orderId}`)
        }
        // console.log(response);
      });
    }
  },
  created() {
    this.getProductList();
    this.getCart();
  }
};
</script>
