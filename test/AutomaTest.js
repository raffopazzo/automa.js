STATE = {
    S1 : "State 1",
    S2 : "State 2",
};

EVENT = {
    E1 : "Event 1"
};

test("Should run action when stay", function() {
    var automa = AUTOMA.automa(STATE.S1);
    var executed = false;
    automa.from(STATE.S1).stay().when(EVENT.E1).andDo(function() { executed = true; });
    automa.signal(EVENT.E1);
    ok(executed === true, "Action not executed");
});

test("Should run action when change state", function() {
    var automa = AUTOMA.automa(STATE.S1);
    var executed = false;
    automa.from(STATE.S1).goTo(STATE.S2).when(EVENT.E1).andDo(function() { executed = true; });
    automa.signal(EVENT.E1);
    ok(executed === true, "Action not executed");
});

test("Should change state", function() {
    var automa = AUTOMA.automa(STATE.S1);
    var executed1 = false;
    var executed2 = false;
    automa.from(STATE.S1).goTo(STATE.S2).when(EVENT.E1).andDo(function() { executed1 = true; });
    automa.from(STATE.S2).stay().when(EVENT.E1).andDo(function() { executed2 = true; });
    automa.signal(EVENT.E1);
    automa.signal(EVENT.E1);
    ok(executed1 === true, "Action 1 not executed");
    ok(executed2 === true, "Action 2 not executed");
});

