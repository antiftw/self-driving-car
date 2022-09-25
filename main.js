const carCanvas  = document.getElementById('main-canvas');
carCanvas.width  =  200;
const networkCanvas  = document.getElementById('network-canvas');
networkCanvas.width  =  300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)
//const car = new Car(road.getLaneCenter(1), 100, 30, 50, "PLAYER");
//const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const N = 500;
const cars = generateCars(N);
let bestCar = cars[0];

if(localStorage.getItem("best-brain")) {
    // if we have a saved "best brain", we give the entire next generation
    // a copy of that brain
    for(let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("best-brain"));
        if(i !== 0) {
            // And then we mutate all brains (except the first one) by
            // a little bit
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    } 
}else {
    // a somewhat pre-trained brain for testing
    //cars[0].brain = {"layers":[{"inputs":[0.485320778845295,0.31595634271158146,0,0,0,0,0,0],"outputs":[0,1,0,1,1,1],"biases":[0.5101672340778123,0.13089638065451575,0.28203956227430804,-0.030874588046424137,-0.3470319823972652,-0.5857682790680953],"weights":[[0.015342722765815432,0.7125098781617768,0.6532157986747129,0.007696667798755871,-0.02671614062447082,-0.3570779105577885],[0.728480634825313,0.6547300732413367,-0.12739133756011753,-0.051886575875756874,0.515244059119014,0.8162906965815965],[0.6126774072742197,0.17423578099863363,0.5691836516183834,-0.17103528877341398,-0.7749607051322379,0.5413389877758326],[0.6240032762122657,0.4623874773279272,0.3696401425500118,-0.4571167374313125,-0.13578436674287359,-0.21839729510873568],[-0.3148237715249761,-0.07538087503837523,-0.4103566718140121,-0.30972895395629424,0.6065912313930117,-0.291694630948625],[-0.2125725412726993,0.17462303531173357,0.4142540678599208,0.08973844821054619,-0.6224634223752388,0.11405222486970107],[0.46697744864724133,-0.6796536824598842,-0.3281333062543071,-0.1628555095815277,-0.38642137983287783,0.5356815678090547],[-0.48164821483154335,-0.3976649004527621,-0.013835684311867519,-0.03645739676336773,0.3616426920774809,0.642985202031723]]},{"inputs":[0,1,0,1,1,1],"outputs":[1,0,0,0],"biases":[-0.5605237706778858,-0.18063792701284748,-0.0939402062452201,0.48865053903382194],"weights":[[0.04015492475583121,0.0015917959246253346,-0.6303222212270126,0.13659365980352173],[-0.3391113845174731,-0.5980163068156615,0.47729890185954915,0.5905372220437767],[0.2911950476266566,-0.3284054852773554,0.7427460900695895,-0.26440573941606077],[0.7406038705597144,-0.4690710334521011,-0.16151341599986252,-0.6546428825786904],[0.5320003899505756,0.252491783527967,-0.6834088196330601,-0.726776813294542],[-0.7077307073455764,-0.0013677674940055506,0.25155708064702986,0.17888539007803106]]}]};

    cars[0].brain = {"layers":[{"inputs":[0,0,0,0,0,0,0.20296120682847252,0.4003024501013044],"outputs":[0,0,0,1,1,1],"biases":[0.4202776078940535,0.07412959252754288,0.21486275021939005,-0.05769971566600329,-0.2744286735187222,-0.4295037678978948],"weights":[[0.018201789690610495,0.47912863073085765,0.4879593864248178,0.025527708737210247,0.11523560302795448,-0.2694573969380317],[0.6207846052475294,0.5679920619478257,0.060872509550034495,0.1109527072369038,0.4401386146711599,0.6801415354924893],[0.5644864513135477,0.30077943885648706,0.3783064480981331,-0.27971364961058,-0.6149927937696755,0.3577011981801532],[0.40966431755718036,0.3694538072091495,0.21312556822994164,-0.3573038317585833,-0.0031432537406418104,-0.27157798746260137],[-0.1829207778006493,0.012044807258907959,-0.43203053539581054,-0.21546216662515918,0.536741652378808,-0.15964402184633714],[-0.16939338989793679,0.1366727169981396,0.32165730270244863,0.07517779966530083,-0.4057998612891772,0.07698006571796763],[0.40732069394986886,-0.4975803021011015,-0.2492290300094672,-0.12519380089997595,-0.28026323796211805,0.4865132491679363],[-0.2942083616886206,-0.22621916309384907,-0.09881627784498889,-0.06664950103785913,0.282847231614061,0.5127666793549878]]},{"inputs":[0,0,0,1,1,1],"outputs":[1,0,0,0],"biases":[-0.42710336692830075,-0.07618049020140952,-0.11785235108879702,0.3925022910246513],"weights":[[0.20089896934174167,-0.032673569359695585,-0.6259306528823593,0.17842823063746477],[-0.3204154938149292,-0.5100992074142663,0.49327747691015617,0.42984345463383733],[0.1590376053965961,-0.26017812916122807,0.6029469523518395,-0.20881515056344807],[0.586283433637398,-0.37868983773613707,-0.2142730198354094,-0.5470482827785204],[0.561506916494426,0.10492762937442265,-0.6221774635385868,-0.5392511500656039],[-0.4564758145003116,0.09712756653155921,0.08053545420965436,0.1661955903482833]]}]}
}
const traffic = [
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2, "red"),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2, "green"),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2, "yellow"),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2, "red"),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2, "green"),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2, "black"),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2, "grey"),
    
    new Car(road.getLaneCenter(1),-900,30,50,"DUMMY",2, "green"),
    new Car(road.getLaneCenter(0),-900,30,50,"DUMMY",2, "yellow"),
    new Car(road.getLaneCenter(2),-1100,30,50,"DUMMY",2, "red"),
    new Car(road.getLaneCenter(0),-1100,30,50,"DUMMY",2, "red"),
    new Car(road.getLaneCenter(1),-1300,30,50,"DUMMY",2, "red"),
    new Car(road.getLaneCenter(1),-1300,30,50,"DUMMY",2, "red"),
    new Car(road.getLaneCenter(2),-1500,30,50,"DUMMY",2, "red"),
]

animate();

function save() {
    localStorage.setItem("best-brain", JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("best-brain");
}

function generateCars(N) {
    const cars = [];
    for(let i = 1; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate(time) {
    // Update all traffic
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    // Update all AI/Player controlled cars
    for(let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    // todo: optimize this function to get a better definition of "best"
    bestCar = cars.find(
        c => c.y === Math.min(     // get the car where the y value is the minimum of 
            ... cars.map(c => c.y) // all y values
        ));
    // Maximize the height of both canvasses
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    // Make sure the camera follows the best car
    carCtx.translate(0, - bestCar.y + carCanvas.height * 0.7)
    
    road.draw(carCtx);
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    }
    // Lower transparancy for all other cars
    carCtx.globalAlpha = 0.2;
    for(let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx);
    }
    // Turn opacity back to 1, so we notice main car better
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true);
    carCtx.restore();

    // Draw the state of the Neural network on the right side
    networkCtx.lineDashOffset = - time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}