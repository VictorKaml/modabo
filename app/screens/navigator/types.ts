export interface TabScreenParams {
    name: string;
    backgroundColor: string;
    nextScreen: string;
    paddingBottom?: number;
}

export type MainTabsParams = {
    Home: TabScreenParams;
    Scanner: TabScreenParams;
    Analytics: TabScreenParams;
    Account: TabScreenParams;
};