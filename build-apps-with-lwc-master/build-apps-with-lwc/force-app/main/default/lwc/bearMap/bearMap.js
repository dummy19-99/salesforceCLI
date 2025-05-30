import { LightningElement, wire } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import BEAR_LIST_UPDATE_MESSAGE from '@salesforce/messageChannel/BearListUpdate__c';
export default class BearMap extends LightningElement {
  mapMarkers = [];
  subscription = null;
  @wire(MessageContext)
  messageContext;
  connectedCallback() {
    // Subscribe to BearListUpdate__c message
    this.subscription = subscribe(
        this.messageContext,
        BEAR_LIST_UPDATE_MESSAGE,
        (message) => {
            this.handleBearListUpdate(message);
        });
  }
  disconnectedCallback() {
    // Unsubscribe from BearListUpdate__c message
    unsubscribe(this.subscription);
    this.subscription = null;
  }
  handleBearListUpdate(message) {
    this.mapMarkers = message.bears.map(bear => {
      const Latitude = bear.Location__Latitude__s;
      const Longitude = bear.Location__Longitude__s;
      return {
        location: { Latitude, Longitude },
        title: bear.Name,
        description: `Coords: ${Latitude}, ${Longitude}`,
        icon: 'utility:animal_and_nature'
      };
    });
  }
}
/*
    コードのポイント
    connectedCallback と disconnectedCallback というコンポーネントライフサイクルのフック関数を 2 つ実装しました。
    これらは、コンポーネントの読み込み時と読み込み解除時に自動的にコールされます。
    これら 2 つの関数を使用して、BearListUpdate__c Lightning メッセージの登録/登録解除を行います。
    BearListUpdate__c イベントを受信すると、
    現在絞り込まれている熊レコードのリストを使用して handleBearListUpdate 関数がただちにコールされます。
    mapMarkers プロパティに渡されて地図コンポーネントに表示される地図マーカーのリストが handleBearListUpdate によって作成されます。
*/