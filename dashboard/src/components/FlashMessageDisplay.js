import React, {useContext} from "react";


const FlashMessageDisplay = () =>{
    const {flashMessage, setFlashMessage} = useContext(FlashMessageContext);

    const clearMessage = () =>{
        setFlashMessage({success: "", error:""});
    };
    return(
        <div>
            <div className="Flashstyle">
                {flashMessage.success && (
                    <div className="flash-message success " onClick={clearMessage}>
                        {flashMessage.success}
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                )}
                {flashMessage.error && (
                    <div className="flash-message error" onClick={clearMessage}>
                        {flashMessage.error}
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlashMessageDisplay