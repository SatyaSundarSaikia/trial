

// Function to toggle the side popup
function display_toggle_side_Popup(id) {
    // Get the element with the specified ID
    const clickedSubMenu = document.getElementById(id);
  
    // Get all existing sub-menus
    const subMenus = document.querySelectorAll('.sidebar_items .side_menu_popup.show');
  
    // Close all open sub-menus except the clicked one
    subMenus.forEach(subMenu => {
      if (subMenu !== clickedSubMenu) {
        subMenu.classList.remove('show'); // Close others
      }
    });
  
    // Toggle the clicked baselayer-menu's visibility
    clickedSubMenu.classList.toggle('show'); // Toggle display
  }





// Add an event listener to the form to prevent click propagation
  document.getElementById('printform').addEventListener('click', function(event) {
    event.stopPropagation();
  });