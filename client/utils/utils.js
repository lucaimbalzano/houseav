

export const checkIfIsAdmin = (currentUser, setAdmin) => {
    try {
        
        currentUser.role.forEach(permission => {
            if (permission === 'updateAll') {
                setAdmin(true);
                return;
            }
        });
    } catch (error) {
        console.log(error)
    }
};


export const formattedDate = (dateInput) => {
    try {
      const date = new Date(dateInput);
      const formattedDate = date.toISOString().split("T")[0];
      return formattedDate;
    } catch (error) {
      console.log(error);
    }
  }
