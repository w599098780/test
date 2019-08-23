bind call apply
相同点:目标函数被调用时，改变this的指向为指定的值
       三个方法都是函数的方法，挂载在Funtion.prototype上
不同点：目标函数调用call和apply后会立即执行
        目标函数调用bind后，不会立即执行，而是返回一个新的函数，调用新函数才会执行目标函数     

使用方式：bind:
       let newFunc= func.bind(thisArg,a,b,c)//thisArg代表this指向，其余是参数
       newFunc()
       call:
       func.call(thisArg,a,b,c)//thisArg代表this指向，其余是参数
       apply:
       func.call(thisArg,[a,b,c])//只能接受2个参数

                   
