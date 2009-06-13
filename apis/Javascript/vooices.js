/*
	Command Structure

	PLAIN TEXT
	============
	The current incarnation of the system sends single commands as plain text, these map directly to 
	on_COMMAND methods.
	
	This means the command_object parameter on the methods will be a string.  Future versions will support XML Documents and JSON Documents.
	
	JSON
	======
	TODO: In the future
	({
	user_id: "",
	user_name: "",
	game_id: "",
	command: "",
	sequence_id : 0
	timestamp: new Date()
	})
	XML
	====
	TODO: In the future
	<vox>
		<user id="">NAME</user>
		<command></command>
		<sequenceId></sequenceId>
		<timestamp></timestamp>
	</vox>
*/

function VooicesAPI()
{
	this.GameController = new Controller()
}

function Controller() {
	// The Connection to the internal system.
	this.session = null;
	/*
		Initializes the Game Controller with the list of commands that are available from the call.
	*/
	this.init = function(commands)
	{
		for(var command in commands)
		{
			this["on_" + commands[command.toLowerCase()]] = function (command_object) { return; }
		}
	}
	
	this.login = function()
	{
		//Logs in 
		var settings = {
					protocol: 'http://jabber.org/protocol/httpbind',
					xmlns: 'urn:ietf:params:xml:ns:xmpp',
					resource: 'vooices',
					mechanism: 'ANONYMOUS',
					port: 5222,
					debug: false
				};
		var hostname = 'http://server.vooices.us/http-bind'
		var username = ''
		var password = ''
		var domain = 'server.vooices.us'
					
		session = new Session(hostname, username, password, domain)					
		session.callbacks().login.success = this.on_logged_in;
		session.callbacks().login.failure = this.on_login_failure;
		session.callbacks().message.received = this.recieve_command; 
		session.setup(settings)
  
		//Open up the connection
		session.open()
	}
	
	/*
		Called when the game is started by the server
	*/
	this.on_start = function () {}
	/*
		Called when the game is ended by the server
	*/
	this.on_finish = function () {}
	
	this.session_id = function()
	{
		if(session != null)
			return session.roster()[0].from.jid;	
	}
	
	/*
		Called when the session is connected.
	*/
	this.on_logged_in = function(){}
	/*
		Called if there was a problem logging in to the XMPP server.
	*/
	this.on_login_failure = function() {}
		
	/*
		This function is only ever called by the internal framework
	*/
	this.recieve_command = function()
	{		
		var obj = Vooices.GameController;
		$(session.queues().messages).each(function(k, v) {
			// Parse the command as it comes in.
			
			var message = v.message;					
			
			if(message != null)
			{
				//var message_obj = eval(v.message);14:47 20/03/2009
				var command = message.toLowerCase()
				obj["on_" + command](command)
			}
		})
	}
}


/*
	Create the API globablly
*/
var Vooices = new VooicesAPI();
