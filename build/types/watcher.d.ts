export declare type TFnWatcher = (oldData?: any) => void;
export declare type TFnRender = () => any;
export interface IWatcher {
    data: any;
    watcher: TFnWatcher;
    render: TFnRender;
    watchData(data: any): void;
}