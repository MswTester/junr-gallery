import React from "react";

interface NavbarProps {
    type?: "button" | "submit" | "reset";
    children?: React.ReactNode;
    onClick?: () => void;
}

const CustomButton = ({type, children, onClick}:NavbarProps) => {
    const [count, setCount] = React.useState(0);

    return <button onClick={onClick}>{children}</button>
}

class Components{
    static Button = CustomButton;
}

export default Components;
