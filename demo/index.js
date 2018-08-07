import { Easiest, Component, Router, Utils, EsModule, Service } from '../build';

class HeroSearchService1 {
  constructor() {
    console.log('js HeroSearchService1 is comming');
  }

  test() {
    console.log('HeroSearchService !!!1111');
  }
}
Service({
  isSingletonMode: true,
})(HeroSearchService1);


class HeroSearchService2 {
  constructor() {
    // super();
  }

  test() {
    console.log('HeroSearchService !!!2222');
  }
}
Service({
  isSingletonMode: false,
})(HeroSearchService2);

class HeroSearchService {
  constructor(
    heroSearchService1,
  ) {
    this.hsr = heroSearchService1;
    this.hsr.test();
  }

  test() {
    console.log('HeroSearchService !!!000000000');
  }
}
Service({
  isSingletonMode: false,
})(HeroSearchService);

class RouteChild {
  constructor(heroSearchService2) {
    this.heroSearchService = heroSearchService2;
    this.heroSearchService.test();
  }

  esHasRender() {
    console.log('RouteChild: this.props.a', this.props.a);
  }
}
Component({
  state: {
    a: 'a',
    d: [
      {
        z: 111111111111111,
        b: 'a',
      },
      {
        z: 33333333333333,
        b: 'a',
      },
    ],
  },
  template: (`
    <div>
    子组件的子组件<br/>
      <p es-on:click="this.props.b(3)">PCChild props.a:: {{this.props.a}}</p>
      <p es-repeat="let a in this.state.d">1232{{a.z}}</p>
    </div>
  `),
})(RouteChild);

class PCChild {
  constructor() {}

  esHasRender() {
    console.log('PCChild: this.props.ax', this.props.ax);
  }
}
Component({
  state: {
    a: 'a',
    d: [
      {
        z: 111111111111111,
        b: 'a',
      },
      {
        z: 33333333333333,
        b: 'a',
      },
    ],
  },
  template: (`
    <div>
    子组件的子组件<br/>
      <p es-on:click="this.props.b(3)">PCChild props.ax:: {{this.props.ax}}</p>
      <p es-repeat="let a in this.state.d">1232{{a.z}}</p>
    </div>
  `),
})(PCChild);

class PComponent {
  constructor() {}

  esOnInit() {
    console.log('props11', this.props);
  }
  componentClick(e) {
    alert('点击了组件');
    console.log('this.props.ax', this.props.ax);
    this.$setState({ b: 2 });
    // this.$setProps({ ax: 5 });
    this.props.b(3);
    this.a = 1;
  }
  sendProps(ax) {
    this.$setProps({ ax: ax });
    this.props.b(ax);
    console.log('this', this);
  }
  getProps(a) {
    alert('子组件里 里面传出来了');
    this.$setState({ a: a });
    this.$setProps({ ax: a });
    this.props.b(a);
  }
  esWatchState(oldData, newData) {
    console.log('oldData Component:', oldData);
    console.log('newData Component:', newData);
  }
}

Component({
  state: {
    a: 'a子组件',
    b: 100,
    c: '<p>1111</p>',
    d: [
      {
        z: 111111111111111,
        b: 'a',
      },
      {
        z: 33333333333333,
        b: 'a',
      },
    ],
    e: true,
  },
  template: (`
    <div>
      $globalContext in Component: <span>{{this.$globalContext.a}}</span>
      <p es-if="this.state.e" es-class="this.state.a" es-repeat="let a in this.state.d"  es-on:click="this.componentClick(this.state.d)">你好： {{a.z}}</p>
      state.d: <input es-repeat="let a in this.state.d" es-model="a.z" />
      <p es-on:click="this.sendProps(5)">props from component.state.a: {{this.props.ax}}</p>
    </div>
  `),
})(PComponent);


class R1 {
  constructor(heroSearchService) {
    this.heroSearchService = heroSearchService;
    this.heroSearchService.test();
    this.utils = new Utils();
  }

  esOnInit() {
    this.utils.setCookie('tutor', {
      name: 'gerry',
      github: 'https://github.com/DimaLiLongJi',
    }, { expires: 7 });
    // console.log('is $this.$globalContext', this.$globalContext);
  }
  esBeforeMount() {
    const cookie = this.utils.getCookie('tutor');
    console.log('cookie is', cookie);
    console.log('is esBeforeMount');
  }
  esAfterMount() {
    // console.log('is esAfterMount');
  }
  $routeChange(lastRoute, newRoute) {
    console.log('R1 is $routeChange', lastRoute, newRoute);
  }
  esWatchState(oldData, newData) {
    console.log('oldData Controller:', oldData);
    console.log('newData Controller:', newData);
  }
  showAlert(a) {
    // console.log('this.$globalContext R1', this.$globalContext);
    // this.$setGlobalContext({ a: 3 });
    // console.log('this.$globalContext R12', this.$globalContext);
    // this.$location.go('/R1/C1', { a: '1' });
    // console.log('this.$location', this.$location.state());
    this.$locationGo('/R1/C1', { a: '1' });
    console.log('this.$location', this.$getLocationState());

    // console.log('location2', history.length);
    // history.go(1);
    // alert('我错了 点下控制台看看吧');
    // console.log('aa', a);
    // console.log('!this.state.f', !this.state.f);
    // this.$setState({
    //   a: 'a2323',
    //   b: 100,
    //   f: !this.state.f,
    // });
    // console.log('state', this.state.f);
  }
  getProps(a) {
    // alert('里面传出来了');
    console.log('被触发了！', a);
    this.$setState({ a: a });
  }
}

Component({
  template: (`
    <div>
      <pc-component ax="{this.state.a}" b="{this.getProps}"></pc-component>
      下面跟组件没关系<br/>
      $globalContext in Component: <span>{{this.$globalContext.a}}</span>
      <div es-if="this.state.f">
        ef
        <input es-repeat="let a in this.state.e" es-model="a.z" />
        <p es-class="this.state.c" es-if="a.show" es-repeat="let a in this.state.e" es-text="a.z" es-on:click="this.showAlert(a.z)"></p>
        <p>111this.state.a：{{this.state.a}}</p>
        <input es-model="this.state.a" />
      </div>
      下面是子路由<br/>
      <router-render></router-render>
    </div>
    `),
  state: {
    a: 'a11',
    b: 2,
    d: [{
      z: 111111111111111,
      b: 'a',
      show: true,
    },
        {
      z: 33333333333333,
      b: 'a',
      show: true,
    }],
    c: 'c',
    e: [{
      z: 232323,
      b: 'a',
      show: true,
    },
        {
      z: 1111,
      b: 'a',
      show: false,
    }],
    f: true,
  },
})(R1);


class R2 {
  constructor(
    heroSearchService1,
    heroSearchService,
  ) {
    this.heroSearchService1 = heroSearchService1;
    this.heroSearchService1.test();
  }
  esOnInit() {
    // console.log('this.$vm', this.$vm);
    // console.log('this.$globalContext R2', this.$globalContext);
    // console.log('this.$location222', this.$location.state());
    // console.log('is esOnInit');
    console.log('this.$location222', this.$getLocationState());
  }
  esBeforeMount() {
    // console.log('is esBeforeMount');
  }
  esAfterMount() {
    // console.log('is esAfterMount');
  }
  esHasRender() {
    console.log('！！father: this.state.a', this.state.a);
  }
  $routeChange(lastRoute, newRoute) {
    console.log('R2 is $routeChange', lastRoute, newRoute);
  }
  esWatchState(oldData, newData) {
    console.log('oldData Controller:', oldData);
    console.log('newData Controller:', newData);
  }
  showAlert() {
    console.log('this.state.a', this.state.a);
    // alert('我错了 点下控制台看看吧');
    // this.$setState(() => ({ a: 2 }));
  }
  bindChange(a) {
    console.log('aaa', a);
  }
  showLocation() {
    // this.$location.go('/R1/C1/D1', { b: '1' });
    // console.log('this.$location', this.$location.state());
  }
}
Component({
  template: (`
    <div>
      <p es-on:click="this.showLocation()">点击显示子路由跳转</p>
      <input es-model="this.state.a"/>
      <br/>
      <p es-on:click="this.showAlert()">点击显示this.state.a:{{this.state.a}}</p>
      子组件:<br/>
      <route-child a="{this.state.a}"></route-child>
    </div>
  `),
  state: { a: 1 },
})(R2);


class Container {
  constructor(
    heroSearchService
  ) {
    // super();
    this.ss = heroSearchService;
    this.ss.test();
  }
  esOnInit() {
    console.log('esOnInit Container');
  }

  esAfterMount() {
    // this.$location.go('/R1', { b: '1' });
  }

  go() {
    // this.$location.go('/R1', { b: '1' });
    this.$locationGo('/R1', { b: '1' });
  }

  show(a) {
    console.log('aaaa', a);
  }
}

Component({
  template: (`
    <div>
      <p es-on:click="this.go()">container: {{this.state.a}}</p>
      <input es-model="this.state.a" />
      <div es-repeat="let man in this.state.testArray">
        <div es-on:click="this.show(man)">姓名：{{man.name}}</div>
        <div>性别：{{man.sex}}</div>
        <input es-model="b" es-on:click="this.show(this.state.testArray2)" es-repeat="let b in man.job" es-class="b" />
      </div>
      <router-render></router-render>
    </div>`
  ),
  state: {
    a: 1,
    testArray: [{
      name: '李龙吉',
      sex: '男',
      job: ['程序员1', '码农1', '帅1'],
    }],
    testArray2: ['程序员3', '码农3', '帅3'],
  },
})(Container);

class M2 {}
EsModule({
  components: {
    'R2': R2,
    'route-child': RouteChild,
    'pp-childs': PCChild,
  },
  providers: [
    HeroSearchService2,
  ],
  exports: [
    'R2',
    'route-child',
  ],
})(M2);

class M1 {}
EsModule({
  imports: [
    M2,
  ],
  components: {
    'container-wrap': Container,
    'pc-component': PComponent,
    'R1': R1,
  },
  providers: [
    HeroSearchService,
    HeroSearchService1,
  ],
})(M1);

const router = new Router();

const routes = [
  {
    path: '/',
    // redirectTo: '/R1',
    component: 'container-wrap',
    children: [
      {
        path: '/R1',
        component: 'R1',
        // redirectTo: '/R2',
        children: [
          {
            path: '/C1',
            component: 'R2',
            children: [
              {
                path: '/D1',
                redirectTo: '/R2',
              },
            ],
          },
          {
            path: '/C2',
            redirectTo: '/R2',
          },
        ],
      },
      {
        path: '/R2',
        component: 'R2',
        children: [
          {
            path: '/:id',
            component: 'R1',
            children: [
              {
                path: '/D1',
                redirectTo: '/R1/C1',
              },
            ],
          },
        ],
      },
    ],
  },
];
router.$setRootPath('/demo');
// router.$setRootPath('/');
router.$init(routes);
router.$routeChange = function (old, next) {
  console.log('$routeChange 3', old, next);
};

const easiest = new Easiest();
// easiest.$bootstrapModule(M1);
easiest.$bootstrapModule(M1);
easiest.$use(router);
easiest.$init();
