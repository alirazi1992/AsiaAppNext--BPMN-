import React from 'react'
const StyledComponent = ({ children, x, onMouseEnter, onMouseLeave }: any) => {
    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                width: "220px",
                height: "100px",
                // padding: "10px 15px",
                borderRadius: "5px",
                display: "inline-block",
                color: "black",
                background: "white",
                fontSize: "13px",
                borderTopWidth: "3px"
                , borderTopColor: x
            }}
        >{children}
        </div>
    )
}

export default StyledComponent; 