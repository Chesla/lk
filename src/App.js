import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ChatStores from './stores/chatstores';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Test1/>
          {<Test2/>}
      </div>
    );
  }
}

export default App;

class Test1 extends Component{
    constructor(props){
        super(props);
        this.state={
            comments:{},
            comment:'',
            showCommentBox:false
        }
        this._getChatStore = this._getChatStore.bind(this);
    }
    componentWillMount(){
       ChatStores.on('change',this._getChatStore);
    }
    
    componentWillUnmount(){
        ChatStores.removeListener('change',this._getChatStore);
    }
    _getChatStore(type){
        if(type=='COMMENT_ADDED'){
            console.log(ChatStores.returnComment());
            this.setState({
                comments:ChatStores.returnComment(),
                comment:'',
                showCommentBox:false
            })
        }

    }
    showComments(comments){
        // debugger;
        return Object.values(comments).map((c,i)=>{

            return(
                <div>
                    <ShowCommentBox text={c.text} key={i} level={i} node={c}/>
                    
                        {c.replies.length?
                            <div className="showComments">
                               { this.showComments(c.replies)}
                                
                            </div>
                            :
                                null
                            
                        }
                    
                </div>
            )
        })
    }
    enterComments(ev){
        this.setState({
            comment:ev.target.value
        })
    }
    addComments(ev){
        if(ev.keyCode===13){
            let com ={};
            let {comments,comment} = this.state;
            comments[Object.keys(comments).length]={text:comment,replies:[]};
            ChatStores.addComment(comments);
        }
    }
    render(){
        let {showCommentBox,comment,comments} = this.state;
        return(
            <div className="showComments">
                <div onClick={()=>{this.setState({showCommentBox:true})}}>Add Comment</div>
                {this.showComments(comments)}
                {showCommentBox && 
                    <input type="text" 
                            value={comment}
                            onChange={(event)=>this.enterComments(event)}
                            onKeyDown={(event)=>{this.addComments(event)}} 
                            placeholder="Add your comment"/>
                }
                
            </div>
        )
    }
}
class ShowCommentBox extends Component{
    constructor(props){
        super(props);
        this.state={
            comment:'',
            showCommentBox:false,
            showEditBox:false,
            editcommenttext:''
        }
    }
    
    addReply(){
        this.setState({
            showCommentBox:true
        })
    }
    enterComments(ev){
        this.setState({
            comment:ev.target.value
        })
    }
    editComments(ev){
        this.setState({
            editcommenttext:ev.target.value
        })
    }
    addComments(ev){
        if(ev.keyCode===13){
            let com ={};
            let c =ChatStores.returnComment();
            let {level,node}=this.props;
            let {comment} = this.state;
            node.replies.push({text:comment,replies:[]});
            ChatStores.addComment(c);
            this.setState({
                showCommentBox:false,
                comment:''
            })
            
        }
    }
    updateComments(ev){
        if(ev.keyCode===13){
            let com ={};
            let c =ChatStores.returnComment();
            let {level,node}=this.props;
            let {editcommenttext} = this.state;
            node.text=editcommenttext;
            ChatStores.addComment(c);
            this.setState({
                showEditBox:false,
                editcommenttext:''
            })
            
        }
    }
    editReply(){
        let {text}=this.props;
        this.setState({
            showEditBox:true,
            editcommenttext:text
        })
    }
    deleteReply(){
       let {node}=this.props;
       let c =ChatStores.returnComment();
       node.text='';
       node.replies=[];
       ChatStores.addComment(c);
       // debugger;
    }
    render(){
        let {text}=this.props;
        let {showCommentBox,comment,editcommenttext,showEditBox} = this.state;
        if(text===''){
            return null;
        }
        return(
            <div>
                <div style={{display:'flex'}}>
                    <div className="actions">
                        User
                    </div>
                    <div className="actions"
                            onClick={()=>{this.editReply()}}>
                        Edit
                    </div>
                     <div className="actions"
                            onClick={()=>{this.addReply()}}>
                        Reply
                    </div>
                    <div className="actions"
                            onClick={()=>{this.deleteReply()}}>
                        Delete
                    </div>
                </div>
                <div>
                    {showEditBox?
                        <input type="text" 
                            value={editcommenttext}
                            onChange={(event)=>this.editComments(event)}
                            onKeyDown={(event)=>{this.updateComments(event)}} 
                            placeholder="Add your comment"/>
                    :
                    <div>{text}</div>
                    }

                </div>
                {showCommentBox && 
                    <input type="text" 
                            value={comment}
                            onChange={(event)=>this.enterComments(event)}
                            onKeyDown={(event)=>{this.addComments(event)}} 
                            placeholder="Add your comment"/>
                }
                
                
            </div>
       )
    }
}

class Test2 extends Component{
    constructor(props){
        super(props);
        this.state={
            fname:'',
            lname:'',
            email:'',
            password:'',
            wrong:{}
        }
    }
    addfname(ev){
        this.setState({
            fname:ev.target.value
        })
    }
    addlname(ev){
        this.setState({
            lname:ev.target.value
        })
    }
    addemail(ev){
        this.setState({
            email:ev.target.value
        })
    }
    addpassword(ev){
        this.setState({
            password:ev.target.value
        })
    }
    checkemail(ev){

        if(ev.keyCode==13){
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))
            {
                return (true);
            }
            else{
                let {wrong} = this.state;
                wrong['email']=true;
                this.setState({
                    wrong
                })
            }
            console.log("wrong email");
        }
    }
    checkFname(ev){
        if(ev.keyCode==13){
            if (/^[A-Za-z\s]+$/.test(this.state.fname)){
                return (true);
            }
            else{
                let {wrong} = this.state;
                wrong['fname']=true;
                this.setState({
                    wrong
                })
            }
            console.log("wrong first name");
        }
    }
    checkLname(ev){
        if(ev.keyCode==13){
            if (/^[A-Za-z\s]+$/.test(this.state.lname)){
                return (true);
            }
            else{
                let {wrong} = this.state;
                wrong['lname']=true;
                this.setState({
                    wrong
                })
            }
            console.log("wrong last name");
        }

    }
    checkPass(ev){
        if(ev.keyCode==13){
            if (/^[A-Za-z0-9\s]+$/.test(this.state.password)){
                return (true);
            }
            else{
                let {wrong} = this.state;
                wrong['password']=true;
                this.setState({
                    wrong
                })
            }
            console.log("wrong password");
        }
    }
    render(){
        let {fname,lname,email,password,wrong}=this.state;
        console.log('wrong',wrong);
        return(
            <div style={{display:'inline-flex',flexDirection:'column'}}> 
                 <input     type="text" 
                            value={fname}
                            className={wrong['fname']?'highlight':'no-highlight'}
                            onKeyDown={(event)=>this.checkFname(event)}
                            onChange={(event)=>{this.addfname(event)}} 
                            placeholder="First Name"/>
                
                 <input type="text" 
                            value={lname}
                            className={wrong['lname']?'highlight':'no-highlight'}
                            onKeyDown={(event)=>this.checkLname(event)}
                            onChange={(event)=>{this.addlname(event)}} 
                            placeholder="Second Name"/>
                 <input type="text" 
                            value={email}
                            className={wrong['email']?'highlight':'no-highlight'}
                            onKeyDown={(event)=>this.checkemail(event)}
                            onChange={(event)=>{this.addemail(event)}} 
                            placeholder="Add your email"/>
                <input type="password" 
                            value={password}
                            className={wrong['password']?'highlight':'no-highlight'}
                            onKeyDown={(event)=>this.checkPass(event)}
                            onChange={(event)=>{this.addpassword(event)}} 
                            placeholder="Add your password"/>
            </div>

        )
    }
}