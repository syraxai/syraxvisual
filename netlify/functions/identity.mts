export default {
  userSignup(event:any){
    return {user:{...event.user,appMetadata:{...event.user.appMetadata,roles:["member"]}}};
  }
};
