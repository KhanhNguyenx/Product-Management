// Permissions
const tablePermissions = document.querySelector("[table-permissions]");
if(tablePermissions) {
  // Submit Data
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    const roles = [];

    const rows = tablePermissions.querySelectorAll("[data-name]");
    rows.forEach(row => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");
      if(name == "id") {
        inputs.forEach(input => {
          const id = input.value;
          roles.push({
            id: id,
            permissions: []
          });
        });
      } else {
        inputs.forEach((input, index) => {
          if(input.checked) {
            roles[index].permissions.push(name);
          }
        });
      }
    });

    const formChangePermissions = document.querySelector("[form-change-permissions]");
    const inputRoles = formChangePermissions.querySelector("input[name='roles']");
    inputRoles.value = JSON.stringify(roles);
    formChangePermissions.submit();
  });

  // Data Default
  const divRecords = document.querySelector("[data-records]");
  if(divRecords) {
    const records = JSON.parse(divRecords.getAttribute("data-records"));
    records.forEach((record, index) => {
      const permissions = record.permissions;
      
      permissions.forEach(permission => {
        const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
        const input = row.querySelectorAll("input")[index];
        input.checked = true;
      });
    });
  }
}
// End Permissions