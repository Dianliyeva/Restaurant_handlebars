const deleteButton = document.getElementById("delete-button");
const restaurantID = window.location.pathname.split("/restaurants/")[1]
console.log(restaurantID);
deleteButton.addEventListener("click", async () => {
    const response = await fetch(`/restaurants/${restaurantID}`, {method: "delete"})
    window.location.assign("/restaurants")
})
