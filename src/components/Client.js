import React from "react"

var ChatComponent = (props) => {
    return(
        <div>
            <ChatList people={props.people}/>
        </div>
    )
}

var ChatList = (props) => {
    return(
        <ul>{props.people.map((person)=><li>{person}</li>)}</ul>
    )
}

export default ChatComponent