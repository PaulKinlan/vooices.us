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

/*
	var BOSH_SERVICE = '/xmpp-httpbind'
var connection = null;

function log(msg) 
{
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}

function rawInput(data)
{
    log('RECV: ' + data);
}

function rawOutput(data)
{
    log('SENT: ' + data);
}

function onConnect(status)
{
    if (status == Strophe.Status.CONNECTING) {
	log('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
	log('Strophe failed to connect.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.DISCONNECTING) {
	log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
	log('Strophe is disconnected.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.CONNECTED) {
	log('Strophe is connected.');
	connection.disconnect();
    }
}

$(document).ready(function () {
    connection = new Strophe.Connection(BOSH_SERVICE);
    connection.rawInput = rawInput;
    connection.rawOutput = rawOutput;

    $('#connect').bind('click', function () {
	var button = $('#connect').get(0);
	if (button.value == 'connect') {
	    button.value = 'disconnect';

	    connection.connect($('#jid').get(0).value,
			       $('#pass').get(0).value,
			       onConnect);
	} else {
	    button.value = 'connect';
	    connection.disconnect();
	}
    });
});

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
		
		Strophe.log = function (level, msg) { //air.trace("STROPHE: " + msg);
		}
		
		this.session = new Strophe.Connection(hostname);
		this.session.rawInput = rawInput;
		this.session.rawOutput = rawOutput;
		//Attempt SASL
		this.session.connect( domain,
			       "",
			       this.on_logged_in);	
	}
	
	this.onMessage = function(msg){
		var elems = msg.getElementsByTagName('body');
		
		if (elems.length > 0) { 
			var body = elems[0].textContent;
			body = body.toLowerCase()
			
			Vooices.GameController["on_" + body](body)
		}
		return true;
	}
	
	function rawInput(data)
	{
		air.trace("INPUT: " + data);
	}
	
	function rawOutput(data)
	{
		air.trace("OUTPUT: " + data);
	}
	
	/*
		Called when the game is started by the server
	*/
	this.on_start = function (command) {}
	/*
		Called when the game is ended by the server
	*/
	this.on_finish = function (command) {}
	
	this.session_id = function()
	{
		if(this.session != null)
			//alert(this.session.jid)
			return this.session.jid;	
	}
	
	/*
		Called when the session is connected.
	*/
	this.on_logged_in = function(){}
	/*
		Called if there was a problem logging in to the XMPP server.
	*/
	this.on_login_failure = function() {}
}


/*
	Create the API globablly
*/
var Vooices = new VooicesAPI();
