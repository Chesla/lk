import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";
class ChatStores extends EventEmitter{
	constructor(){
		super();
		this.comments={};
	}
	addComment(comments){
		this.comments=comments;
		this.emit('change','COMMENT_ADDED');
	}
	returnComment(){
		return this.comments;
	}
	
}

const chatStores = new ChatStores();
// dispatcher.register(chatStores._handleActions.bind(chatStores));
export default chatStores;
