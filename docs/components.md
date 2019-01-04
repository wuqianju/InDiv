## 构建一个组件

在这一组文章中, 您将了解 InDiv 的组件`Component`。主要是了解基本的 InDiv 应用程序组件化是如何建立的。您将构建两个基本的组件，并学习组件是如何交互的。


## 组件

InDiv 基于组件。在 InDiv 中最典型的数据显示方式，就是把 字符串模板 中的控件绑定到 InDiv 组件。

为了创建一个基本的组件，我们必须使用`装饰器`。多亏了他们，InDiv 知道如何将组件渲染为一个真实的 DOM 。

首项我们先创建个文件夹 components 用来保存所有的组件 

此时的项目目录应该为

```
src
|
├── components
├── modules
├── app.component.ts
├── app.style.less
├── app.module.ts
├── index.html
└── main.ts
```


## 装饰器`@Component`

让我们先用 装饰器`@Component` 写个根组件

> app.component.ts

```typescript
import { Component } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`<div class="app-component-container"></div>`),
})
export default class AppComponent {}
```

这个装饰器是强制性的，每个被创建的 InDiv 组件都需要使用 `@Component`。

`@Component` 接收三个参数，`selector: string;` `template: string;` `providers?: (Function | TUseClassProvider | TUseValueProvider)[];`

* `selector: string;`  作为组件被渲染成 DOM 的标签，类似于 `<div></div>`
* `template: string;` 视图模板，用来声明被渲染的视图
* `providers?: (Function | { provide: any; useClass: Function; } | { provide: any; useValue: any; })[];` 声明可以被组件注入的服务，这个我们放到服务再讲

现在我们将 `AppComponent` 在 `app.module.ts` 中声明一下并放入引导启动的 `bootstrap`中。启动http服务就可以看到页面上渲染出 `AppComponent` 的模板了。

> app.module.ts

```typescript
import { NvModule } from '@indiv/core';
import AppComponent from './app.component';

@NvModule({
  imports: [],
  declarations: [ AppComponent ],
  providers: [],
  bootstrap: AppComponent,
  exports: [],
})
export default class AppModule {}
```


## 状态 与 内置指令

一个组件的交互行为应该由组件内部的状态决定。类似于 `React` 和 `Vue`，InDiv 选择将组件模板上所有用到的类成员属性都收集起来集中管理。

在组件内中声明一个属性

> app.component.ts

```typescript
import { Component } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`<div class="app-component-container"></div>`),
})
export default class AppComponent {
   public name: string = 'InDiv';
}
```

为了将状态表现在页面上，我们需要用模板语法及内置指令将状态绑定到模板上的某些属性。
当我们更改 模板`template` 上面的变量时，页面也会随着模板而变化。
当然，具体模板语法之后详细再了解。

> app.component.ts

```typescript
import { Component } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <p>name: {{name}}</p>
        </div>
    `),
})
export default class AppComponent {
  public name: string = 'InDiv';
}
```

当然在具体业务中，但是内部使用了`Object.defineProperty`这个api，数组及一些的更改无法被监听到。因此在生命周期 `constructor` 和 `nvOnInit` 之后，组件实例上的变量增加删除或数组的一些方法将无法更新视图，因此我们需要引入一个新的方法 `setState` 来重新设置状态收集及监听。

> app.component.ts

```typescript
import { Component, setState, SetState } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <p on-on:click="addAge()">name: {{name}}</p>
        </div>
    `),
})
export default class AppComponent {
  public name: string = 'InDiv';
  public age: number;

  public setState: SetState;

  constructor() {
    this.setState = setState;
  }

  public addAge(): void {
    this.setState({ age: 24 });
  }
}
```

像上面的例子中，因为在编译时仅仅将 组件模板 中的成员变量收集起来做监听，因此`age`并没有在监听。可是如果我们想让`age`的变化也引起一次更新，那么就需要引入新的注解 `@Watch` 来告诉组件，除了模板上用到的，还有其他需要监听变化的成员变量。

> app.component.ts

```typescript
import { Component, setState, SetState, Watch } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <p on-on:click="@addAge()">name: {{name}}</p>
        </div>
    `),
})
export default class AppComponent {
  public name: string = 'InDiv';
  @Watch() public age: number;

  public setState: SetState;

  constructor() {
    this.setState = setState;
  }

  public addAge(): void {
    this.setState({ age: 24 });
  }
}
```

除此以外组件中还可以通过直接指定 `constructor` 参数为 `InDiv` 导入 InDiv实例，直接指定 `constructor` 参数为 内置类型 `ElementRef` 来获得当前组件的 DOM 实体，或直接指定`constructor`参数为 内置类型 `Render` 来获得当前组件的 Render来操作DOM。


## 组件通信: inputs

InDiv 的组件之间可以 `inputs` 来通信。此外还可以通过 `service` 与 `rxjs` 来进行响应式通信。

组件间通信应该是单向的，通过传递值到子组件，并通过传递一个回调方法在子组件调用来更改对应父组件的值来完成通信，`inputs` 可以是一个**被单向传递的值**，也可以是一个**提供给子组件使用的回调函数**。
直接改变被收集的依赖时，或通过 setState 更改被收集的依赖时，被更改的依赖会被立刻改变，因此更改类属性的行为是**同步的**。
但是更改收集的依赖时，会触发异步的重新渲染，并在渲染后更新子组件的 `inputs`，因此，通过在子组件中调用 `inputs` 上的方法来更新父组件的依赖状态时，子组件的 `inputs` 并不会立即更新。
如果想知道子组件的 `inputs` 何时被更新，应该通过生命周期 nvReceiveInputs(nextInputs: any) 或 Class的getter setter方法去监听 `inputs` 的变化。

我们在 components 文件夹下面写一个组件: `<show-age></show-age>`

我们需要使用新的属性装饰器 `@Input` 来告诉组件该项为注册 `input` 的一个属性或方法

> components/show-age/show-age.component.ts

```typescript
import { Component, setState, SetState, nvReceiveInputs, Input } from '@indiv/core';

@Component({
    selector: 'show-age',
    template: (`<p>age: {{age}}</p>`),
})
export default class ShowAgeComponent implements nvReceiveInputs {
  @Input() public age: number;

  public setState: SetState;

  constructor() {
    this.setState = setState;
  }

  public nvReceiveInputs(nextInputs: { age: number }): void {
    this.age = nextInputs.age;
  }
}
```

现在该组件只能被动接收来自父组件的传入，现在我们要使用 回调函数 主动通知父组件更新 `input` age

假设父组件传来个回调函数`updateAge(age: number)`，我们同样可以用 `@Input` 来注册对应的方法

> components/show-age/show-age.component.ts

```typescript
import { Component, setState, SetState, nvReceiveInputs, Input } from '@indiv/core';

@Component({
    selector: 'show-age',
    template: (`<p nv-on:click="updateAge()">age: {{age}}</p>`),
})
export default class ShowAgeComponent implements nvReceiveInputs {
  @Input() public age: number;
  @Input() public upDateAge: (age: number) => void;

  public setState: SetState;

  constructor() {
    this.setState = setState;
  }

  public nvReceiveInputs(nextInputs: { age: number }): void {
    this.age = nextInputs.age;
  }

  public updateAge() {
    this.upDateAge(3);
  }
}
```

当然 `@Input` 可以接收一个参数，`@Input(name?: string)`。

该参数`name`是组件被绑定的 `input` 的名字，默认情况被绑定的 `input` 的名字与被添加属性解释器的属性或方法名字相同。传入该参数可以指定某个属性或方法为对应的`input`。

下面让我们更改下 `@Input` 的参数来指定下组件的 `inputs`。

> components/show-age/show-age.component.ts

```typescript
import { Component, setState, SetState, nvReceiveInputs, Input } from '@indiv/core';

@Component({
    selector: 'show-age',
    template: (`<p nv-on:click="updateAge()">age: {{age}}</p>`),
})
export default class ShowAgeComponent implements nvReceiveInputs {
  @Input('age') public age: number;
  @Input('upDateAge') public changeAge: (age: number) => void;

  public setState: SetState;

  constructor() {
    this.setState = setState;
  }

  public nvReceiveInputs(nextInputs: { age: number }): void {
    this.age = nextInputs.age;
  }

  public updateAge() {
    this.changeAge(3);
  }
}
```

现在我们把新的`ShowAgeComponent`也在 根模块 中声明一下，并在 `AppComponent` 中使用一下。
与普通的指令不同，inputs 的值在组件中应用 `{}` 包一下，例如 `age="{age}"`。

> app.component.ts

```typescript
import { Component, setState, SetState, Watch } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <p on-on:click="addAge()">name: {{name}}</p>
          <show-age age="{age}" upDateAge="{upDateAge}"></show-age>
        </div>
    `),
})
export default class AppComponent {
  public name: string = 'InDiv';
  @Watch() public age: number;

  public setState: SetState;

  constructor() {
    this.setState = setState;
  }

  public addAge(): void {
    this.setState({ age: 24 });
  }

  public upDateAge(age: number) {
    this.age = age;
    // this.setState({ age: 24 });
  }
}
```


## 生命周期

每个组件都有一个被 InDiv 管理的生命周期。
生命周期钩子其实就是定义在实例中的一些方法，在 InDiv 中，通过不同的时刻调用不同的生命周期钩子，赋予你在它们发生时采取行动的能力。
在 TypeScript 中，引用 InDiv 提供的 interface，通过 implements 的方式让类去实现被预先定义好的生命周期，而在 JavaScript 中，你只能自己手动去定义应该实现的生命周期方法。

之前我们已经通过认识 `inputs` 认识了 `nvReceiveInputs` 的生命周期，而下面将介绍其他生命周期钩子。

* `constructor` 在类被实例化的时候回触发，你可以在这里初始化
* `nvOnInit(): void;` constructor 之后，在这个生命周期中，可以获取 inputs，此生命周期会在开启监听前被触发，并且之后再也不会触发
* `nvBeforeMount(): void;` 在 nvOnInit 之后，template 挂载页面之前被触发，每次触发渲染页面都会被触发
* `nvAfterMount(): void;` 在 nvBeforeMount 之后，template 挂载页面之后被触发，每次触发渲染页面（render）都会被触发
* `nvHasRender(): void;` 在 nvAfterMount 之后，渲染完成后被触发，每次触发渲染页面（render）都会被触发
* `nvRouteChange(lastRoute?: string, newRoute?: string): void;` 监听路由变化，当更换路由后被触发
* `nvOnDestory(): void;` 仅仅在路由决定销毁此组件时,或是被`nv-if`销毁组件时被触发
* `nvDoCheck(): void;` 监听被监听的属性变化，当被监听的属性被更改后触发
* `nvReceiveInputs(nextInputs: any): void;` 监听 inputs 变化，当 inputs 即将被更改时（更改前）触发
* (原生)`getter`: 当监听 inputs 时，getter 会先于 nvReceiveInputs 被触发
* (原生)`setter`: 当监听 属性 时，setter 会晚于 nvDoCheck 被触发