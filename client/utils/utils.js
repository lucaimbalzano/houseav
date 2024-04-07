

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