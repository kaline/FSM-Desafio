
function createMachine(stateMachineDefinition){
	const machine = {
		value: stateMachineDefinition.initialState,
		transition(currentState, event){
			const currentStateDefinition = stateMachineDefinition[currentState]
			const destinationTransition = currentStateDefinition.transitions[event]
			
			if(!destinationTransition){
				return
			}
			
			const destinationState = destinationTransition.target
			const destinationStateDefinition = stateMachineDefinition[destinationState]
			
			destinationTransition.action()
			currentStateDefinition.actions.onExit();
			currentStateDefinition.actions.onEnter();

			machine.value = destinationState;

			return machine.value
		},
	
	}
	return machine;
}

const machine = createMachine({
	initialState:'off',
	off:{
		actions:{
			onEnter() {
				console.log('onEnter: off');	
			},
			onExit() {
				console.log('onExit: off');
			},
			
		},

		transitions:{
			switch:{
				target:'on',
			action() {
			console.log('transition action for "switch" in off state');
			},
			}, 
		
		},
	},
	on: {
		actions:{
			onEnter() {
				console.log('onEnter: on');	
			},
			onExit() {
				console.log('onExit: on');
			},
		},

		transitions:{
			switch: {
				target:'off',
			action() {
			console.log('transition action for "switch" in on state');
			},
			},
		

		},
	},
	
})


let state = machine.value

console.log(`current state: ${state}`);

state = machine.transition(state,'switch');
console.log(`current state, ${state}`);
state = machine.transition(state,'switch');
console.log(`current state, ${state}`);
