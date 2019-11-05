<template>
  <div class="hello">
   <a href="#" @click.prevent="signout">登出</a>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods:{
    signout(){
       const api = process.env.VUE_APP_APIPATH + 'logout';
      const vm = this;
      this.$http.post(api).then((response) => {
      console.log(response.data)
      if(response.data.success){
        vm.$router.push('/login');
      }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
