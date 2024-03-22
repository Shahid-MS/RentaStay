function deleteFunction() {
  event.preventDefault(); // prevent form submit
  var form = event.target.form; // storing the form
  swal(
    {
      title: "Are you sure?",
      text: "You will not be able to retrieve the list.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, Delete it!",
      cancelButtonText: "No, cancel please!",
      closeOnConfirm: false,
      closeOnCancel: false,
    },
    function (isConfirm) {
      if (isConfirm) {
        form.submit(); // submitting the form when user press yes
      } else {
        swal("Cancelled", "Your lis is safe :)", "error");
      }
    }
  );
}
