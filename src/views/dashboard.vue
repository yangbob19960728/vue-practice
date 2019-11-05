<template>
  <div>
    <Navbar/>
    <AlertMessage/>
    <div class="container-fluid">
      <div class="row">
        <Siderbar/>

        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <router-view/>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Siderbar from "@/components/Siderbar";
import Navbar from "@/components/Navbar";
import AlertMessage from "@/components/AlertMessage";
export default {
  components: {
    Siderbar,
    Navbar,
    AlertMessage
  }
};
</script>