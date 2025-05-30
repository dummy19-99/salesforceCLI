import { publish, MessageContext } from 'lightning/messageService';
import BEAR_LIST_UPDATE_MESSAGE from '@salesforce/messageChannel/BearListUpdate__c';
import { NavigationMixin } from 'lightning/navigation';
import { LightningElement, wire } from 'lwc';
/** BearController.searchBears(searchTerm) Apex method */
import searchBears from '@salesforce/apex/BearController.searchBears';
export default class BearList extends NavigationMixin(LightningElement) {
	searchTerm = '';
    bears;
    @wire(MessageContext) messageContext;
    @wire(searchBears, {searchTerm: '$searchTerm'})
    loadBears(result) {
    this.bears = result;
    if (result.data) {
        const message = {
        bears: result.data
        };
        publish(this.messageContext, BEAR_LIST_UPDATE_MESSAGE, message);
    }
    }
	handleSearchTermChange(event) {
		// Debouncing this method: do not update the reactive property as
		// long as this function is being called within a delay of 300 ms.
		// This is to avoid a very large number of Apex method calls.
		window.clearTimeout(this.delayTimeout);
		const searchTerm = event.target.value;
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		this.delayTimeout = setTimeout(() => {
			this.searchTerm = searchTerm;
		}, 300);
	}
	get hasResults() {
		return (this.bears.data.length > 0);
	}
	handleBearView(event) {
		// Get bear record id from bearview event
		const bearId = event.detail;
		// Navigate to bear record page
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: bearId,
				objectApiName: 'Bear__c',
				actionName: 'view',
			},
		});
	}
}


/*
import { LightningElement, wire } from 'lwc';
import ursusResources from '@salesforce/resourceUrl/ursus_park';
import searchBears from '@salesforce/apex/BearController.searchBears';
export default class BearList extends LightningElement {
	searchTerm = '';
	@wire(searchBears, {searchTerm: '$searchTerm'})
	bears;
	appResources = {
		bearSilhouette: `${ursusResources}/standing-bear-silhouette.png`,
	};
	handleSearchTermChange(event) {
		window.clearTimeout(this.delayTimeout);
		const searchTerm = event.target.value;
		this.delayTimeout = setTimeout(() => {
			this.searchTerm = searchTerm;
		}, 300);
	}
	get hasResults() {
		return (this.bears.data.length > 0);
	}
}

コードのポイント:
リアクティブな searchTerm プロパティを追加し、それをワイヤード Apex のパラメーターとして searchBears に渡します。
検索入力項目の値の変化に反応するために handleSearchTermChange 関数が使用されています。
リアクティブな searchTerm プロパティを更新するときに、意図的に 300 ミリ秒の遅延を発生させます。
更新が保留中の場合は、キャンセルして 300 ミリ秒後に新しい更新を再スケジュールします。
ユーザーが単語を形成する文字を入力するときに、この遅延によって Apex コールの数が削減されます。
1 文字ごとに handleSearchTermChange へのコールがトリガーされますが、
理想的なのは、ユーザーが入力し終わったときに searchBears が 1 度だけコールされることです。
この手法を「デバウンス」といいます。
hasResults 式を公開して、検索で熊が返されたかどうかを確認します。
*/


/*

import { LightningElement } from 'lwc';
import ursusResources from '@salesforce/resourceUrl/ursus_park';

import getAllBears from '@salesforce/apex/BearController.getAllBears';
export default class BearList extends LightningElement {
	bears;
	error;
	appResources = {
		bearSilhouette: `${ursusResources}/standing-bear-silhouette.png`,
	};
	connectedCallback() {
		this.loadBears();
	}
	loadBears() {
		getAllBears()
			.then(result => {
				this.bears = result;
			})
			.catch(error => {
				this.error = error;
			});
	}
}

コードのポイント

ursusResources アダプターをインポートします。これでアプリケーションに関連付けられた静的リソースにアクセスできます。
このアダプターを使用して、テンプレートに熊のシルエット画像の URL を公開する appResources オブジェクトを作成します。
getAllBears アダプターをインポートします。これで BearController.getAllBears() Apex メソッドを操作できます。
BearController クラスは、このプロジェクトの始めにリリースしたコードにバンドルされています。getAllBears メソッドは、
すべての熊レコードを取得するクエリの結果を返します。
connectedCallback 関数を実装します。これでコンポーネントが読み込まれた後にコードを実行できます。
この関数を使用して loadBears 関数をコールします。
loadBears 関数は getAllBears アダプターをコールします。
アダプターは Apex コードをコールし、JS promise を返します。
この promise を使用して、返されたデータを bears プロパティに保存するか、
エラーを報告します。このアプローチによるデータの取得は、命令型 Apex と呼ばれます。
*/