function s(){
    console.log(this);
}
var s1 = {
    t1: function(){ // 测试this指向调用者
        console.log(this); // s1
        s(); // Window // 此次调用仍然相当 window.s()，调用者为window
    },
    t2: () => { // 测试箭头函数，this并未指向调用者
        console.log(this);
    },
    t3: { // 测试对象中的对象
      tt1: function() {
           console.log(this);
      }  
    },
    t4: { // 测试箭头函数以及非函数调用this并未指向调用者
      tt1: () => {
           console.log(this);
      }  
    },
    t5: function(){ // 测试函数调用时箭头函数的this的指向，其指向了上一层对象的调用者
        return {
            tt1: () => {
                console.log(this);
            }
        }
    }
}
s1.t1(); // s1对象 // 此处的调用者为 s1 所以打印对象为 s1
s1.t2(); // Window
s1.t3.tt1(); // s1.t3对象
s1.t4.tt1(); // Window
s1.t5().tt1(); // s1对象