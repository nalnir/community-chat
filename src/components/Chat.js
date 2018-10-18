import React from "react"
import io from "socket.io-client"
import {Paper, Button, TextField, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails} from '@material-ui/core'
import axios from 'axios'
import _ from 'lodash'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMoreIcon';

import './Chat.css'

class Chat extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            expanded: null,
            ids: [],
            // id: '',
            recipient: '',
            sender: '',
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

        const addId = (data) => {
            axios.get(`http://18.191.254.197/getprofile${data.url}`)
            .then((user) => {
                let username = user.data.firstName + ' ' + user.data.lastName
                let id = data.id

                let clients = data.clients
                for(let i = 0; i < clients.length; i++) {
                    if(clients[i] === id) {
                        let client = {
                            id: id,
                            username: username
                        }
                        this.socket.emit('clients-to-server', client)
                        this.socket.on('server-to-client', function(data) {
                            setIDS(data)
                        })
                    }
                }
            })
        }

        const setIDS = data => {
            this.setState({ids: _.uniqBy(data, 'username')})
        }

        const removeClient = data => {
            this.state.ids.map((client, i) => {
                if(client.id === data) {
                    this.state.ids.splice(i, 1)
                };
            })
            this.setState({ state: this.state });
        }

        this.sendMessage = ev => {
            ev.preventDefault();
            let author = ''
            // this.setState({sender: this.socket.id})
            for (let i = 0; i < this.state.ids.length; i++) {
                if (this.state.ids[i].id === this.socket.id) {
                    author = this.state.ids[i].username
                    console.log(author)
                }
            }
            this.socket.emit('SEND_MESSAGE', {
                sender: this.socket.id,
                recipient: this.state.recipient,
                author: author,
                message: this.state.message
            })
            this.setState({message: ''});
            console.log('Current socket id', this.socket.id)
            console.log('These are clients', this.state.ids)
        }

        const addMessage = data => {
            this.setState({messages: [...this.state.messages, data]});
        };

        this.handleChange = panel => (event, expanded) => {
            this.setState({
              expanded: expanded ? panel : false,
            });
        };

        // this.handleRecipient = e => {
        //     console.log(e.target.key)
        // } 
    }
    
    render() {
        return (      
            <div>
            <Paper>
                {this.state.ids.map((client, i) => {
                    return(     
                    <div key={client.id} data-tag={client.id} className='chat-container' onClick={()=> {this.setState({recipient: client.id})}}>
                    <ExpansionPanel expanded={this.state.expanded === i} onChange={this.handleChange(i)}>
                        <ExpansionPanelSummary>
                        <Typography>{client.username}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                <div className="messages">
                                    {this.state.messages.map(message => {
                                        console.log(message.sender)
                                        if(message.sender !== message.recipient && this.socket.id === message.recipient && client.id === message.sender) {
                                            return (
                                                <div><span className='author'>{message.author}:</span> {message.message}</div>
                                            )
                                        } 
                                        else if(message.sender === message.recipient && client.id === message.sender) {
                                            return (
                                                <div><img src='https://vignette.wikia.nocookie.net/polandball/images/6/69/Forever-alone-400x400.png/revision/latest?cb=20160311230442'/></div>
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