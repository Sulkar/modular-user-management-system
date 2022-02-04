let data = {
  key: "value",
};

function updateProfile() {
  fetch("./db/db_profile_update.php", {
    method: "post",
    body: JSON.stringify(data),
  }).then((data) => {
    // data is anything returned by your API/backend code
  });
}
