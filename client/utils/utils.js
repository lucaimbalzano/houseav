

export const checkIfIsAdmin = (currentUser, setAdmin) => {
    try {
        // currentUser.role.forEach(permission => {
        //     if (permission === 'updateAll') {
        //         setAdmin(true);
        //         return;
        //     }
        // });
        if(currentUser.user.fkRoleId.name == 'admin'){
          setAdmin(true);
          return;
        }
    } catch (error) {
        console.log(error)
    }
};


export const formattedDate = (dateInput) => {
    try {
        
      if (!dateInput) {
        throw new Error('Invalid date input');
      }
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      
      const formattedDateISO = date.toISOString().split("T")[0];
      return formattedDateISO;
    } catch (error) {
      console.log(error);
      return ''; // Return an empty string or handle the error as needed
    }
  };
  
