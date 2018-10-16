import React from "react"
import io from "socket.io-client"
import {Paper, Button, TextField, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails} from '@material-ui/core'
import axios from 'axios'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMoreIcon';

import './Chat.css'

class Chat extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            expanded: null,
            clients: [],
            id:'',
            username: 'Lukas',
            recipient: '',
            message: '',
            messages: []
        };

        this.socket = io('localhost:8080');

        this.socket.on('disconnected', function(data) {
            removeClient(data)
        })

        this.socket.on('RECEIVE_MESSAGE', function(data){
            addMessage(data);
        });

        this.socket.on('client', function(data) {
            addId(data);
        })

        this.socket.on('allClients', function(data) {
            addAllClients(data)
        })


        const addMessage = data => {
            console.log(data);
            this.setState({messages: [...this.state.messages, data]});
            console.log(this.state.messages);
        };

        const addId = data => {
            this.setState({id: data})
        }

        const removeClient = data => {
            this.state.clients.map((client) => {
                if(client === data) {
                    this.state.clients.splice(client, 1)
                };
            })
            this.setState({ state: this.state });
        }

        const addAllClients = data => {
            this.setState({clients: data});
        }

        this.sendMessage = ev => {
            ev.preventDefault();
            this.socket.emit('SEND_MESSAGE', {
                recipient: this.state.recipient,
                author: this.state.username,
                message: this.state.message
            })
            this.setState({message: ''});
        }

        this.handleChange = panel => (event, expanded) => {
            this.setState({
              expanded: expanded ? panel : false,
            });
        };
    }
    
    render() {
        return (      
            <div>
            <Paper>
                {this.state.clients.map((client, i) => {
                    return(     
                    <div key={client} className='chat-container' onClick={()=> {this.setState({recipient: client})}}>
                    <ExpansionPanel expanded={this.state.expanded === i} onChange={this.handleChange(i)}>
                        <ExpansionPanelSummary>
                        <Typography>{client}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                <div key={client} className="messages">
                                    {this.state.messages.map(message => {
                                        if(client === this.state.id) {
                                            return (
                                                <div>{message.author}: {message.message}</div>
                                            )
                                        }
                                    })}
                                </div>
                                <div className="card-footer">
                                    <TextField 
                                        id="outlined-bare" 
                                        margin="normal" 
                                        variant="outlined" 
                                        placeholder="Message" 
                                        value={this.state.message} 
                                        onChange={ev => this.setState({message: ev.target.value})}/>
                                    <br/>
                                <Button onClick={this.sendMessage} variant="outlined" color="primary">Send</Button>
                                </div>
                        </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  </div>
                )})}
            </Paper>
            </div>
        );
    }
}

export default Chat;