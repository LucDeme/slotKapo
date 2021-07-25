var slotNb = 3;
var slotRolls= [];

var symCount = 8;
var symSize = 200;

var proba = [8, 6, 25, 25, 12, 1, 2, 0.2]; //cloche fraise pasteque cerise  raison 7 fer diamond

var timeBetweenRoll = 10;

var firstMinTurn = 3;
var firstMaxTurn = 4;

var nextMinSym = 2;
var nextMaxSym = 4;

$(document).ready(function() {
	let slots = $('<div>').appendTo($('body')).addClass('slots');
	for (let i = 0; i < slotNb; i++) {
		let roll = $("<div>").appendTo(slots).addClass('slot');
		slotRolls[i] = roll;
	}

	let button = $('<button>').attr('id', 'roll').text('roll');
	button.on("click", rollSlots);
	
	slots.append(button);
})

function rollSlots() {
	slotRolls.forEach(slot => { slot.stop(); });
	
	var rand = Math.random()*100;
	let totalProba = 0;
	let symIndex;
	for (symIndex = 0; symIndex < symCount; symIndex++) {
		totalProba += proba[symIndex];
		if(totalProba >= rand)
			break;
	}
	
	if(symIndex < symCount) {
		for (let slotId = 0; slotId < slotNb; slotId++) {
			let slot = slotRolls[slotId];
			let curIndex = getSymIndex(slot)%symCount;
			let rollNb = symIndex-curIndex+getTurns(slotId);
			slotRoller(slot, rollNb);
		}
	} else {
		let symId = [];
		let areEquals = true;
		while(areEquals) {
			for(let id = 0; id < slotNb; id++) {
				symId[id] = Math.random()*symCount;
				if(id == 0) continue;
				if(symId[id-1] != symId[id]) {
					areEquals = false;
					break;
				}
			}
		}
		for(let slotId = 0; slotId < slotNb; slotId++) {
			symId = Math.floor(Math.random()*symCount);
			let slot = slotRolls[slotId];
			let rollNb = symId+getTurns(slotId);
			slotRoller(slot, rollNb);
		}
	}
}

function getSymIndex(slot) {
	return Math.floor(parseInt(slot.css("background-position-y"))/symSize);
}

function getTurns(id) {
	return Math.floor((Math.random()*(firstMaxTurn+1-firstMinTurn)+firstMinTurn)+(Math.random()*(nextMaxSym*id+1-nextMinSym*id)+nextMinSym*id))*symCount
}

function slotRoller(slot, nb) {
	if(nb <= 0) return;
	slot.animate(
		{ backgroundPositionY: (getSymIndex(slot)*symSize+symSize+100)+"px" },
		(nb > 10 ? timeBetweenRoll : timeBetweenRoll*20/(nb+1)),
		"linear",
		function() { slotRoller(slot, --nb) }
	);
}

