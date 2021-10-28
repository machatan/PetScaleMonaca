//
// 任意のデータを消せる機能
// データに備考欄を追加
// グラフのしたに備考欄リスト表示
//
// [NCMB] APIキー設定
var appKey    = "0e4ba987a396f2f76fcbf2e9ae4ae943e6100140954dceea1d963c06d49d9cc6";
var clientKey = "3509a11bc9295ae1ce14e49f0e0efdda0089e295f7ea75cd792b28c625c7771c";

// [NCMB] SDKの初期化
var ncmb = new NCMB(appKey, clientKey);

// ログイン中の会員
var currentLoginUser; 

function displayLineChart() {       
// loading の表示
$.mobile.loading('show');
//降順で取得
var petName1 = currentLoginUser.get("petname1");
var petName2 = currentLoginUser.get("petname2");
var graph_data = {
    labels: [],
    datasets: [
        {
            label: petName1,
                    backgroundColor: "rgba(179,0,198,0.2)",
                    borderColor: "rgba(179,181,198,1)",
                    pointBackgroundColor: "rgba(179,181,198,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(179,181,198,1)",
                    
                    fillColor: "rgba(179,0,198,0.2)",
                    strokeColor: "rgba(254,230,170,1)",
                    pointColor: "rgba(254,230,170,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointRadius: 6,
                    pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
        },
        {
            label: petName2,
                    backgroundColor: "rgba(0,179,198,0.2)",
                    borderColor: "rgba(179,181,198,1)",
                    pointBackgroundColor: "rgba(179,181,198,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(179,181,198,1)",
                    
                    fillColor: "rgba(0,179,198,0.2)",
                    strokeColor: "rgba(2,230,170,1)",
                    pointColor: "rgba(2,230,170,1)",
                    pointStrokeColor: "#ff0",
                    pointHighlightFill: "#ff0",
                    pointRadius: 6,
                    pointHighlightStroke: "rgba(120,120,120,1)",
            data: []
        }
    ]
};
var uid1 = currentLoginUser.get("pet1_ID");
var uid2 = currentLoginUser.get("pet2_ID");

console.log(uid1);
var P_Weight = ncmb.DataStore("weight");
P_Weight.equalTo("uid",uid1)
        .order("createDate", true)
        .limit(30)
        .fetchAll()
        .then(function(results){
            console.log("Successfully retrieved " + results.length + " scores.");
            graph_data.datasets[0].label = petName1;
            console.log(results[0]);
            var length_count = results.length;
            for (var i = 0; i < results.length; i++) {
                var object = results[length_count-i-1];
                var strAry = results[length_count-i-1].createDate.split('T');
                //console.log(strAry[0]);
                graph_data.labels[i] = strAry[0];
                graph_data.datasets[0].data[i] =  object.weight;
            }
        })
        .catch(function(error){
                 /* 処理失敗 */
                 alert("グラフデータ生成でエラーが発生しました。");
                 console.log("グラフデータ生成でエラーが発生しました：" + error);
                 // loading の表示終了
                 $.mobile.loading('hide');
        });
        


P_Weight.equalTo("uid",uid2)
        .order("createDate", true)
        .limit(30)
        .fetchAll()
        .then(function(results){
            console.log("Successfully retrieved " + results.length + " scores.");
            graph_data.datasets[1].label = petName2;
            console.log(results[0]);
            var length_count = results.length;
            for (var i = 0; i < results.length; i++) {
                var object = results[length_count-i-1];
                //graph_data.labels[i] = i+1;
                //graph_data.labels[i] = object.CreateDate();
                graph_data.datasets[1].data[i] =  object.weight;
            }
            var ctx = document.getElementById("lineChart").getContext("2d");
            var lineChart = new Chart(ctx,{
               type : "line",
               data : graph_data,
               scaleShowVerticalLines: false,
               scaleShowHorizontalLines: false,
               scaleOverride : true,
               scaleSteps : 10,
               scaleStepWidth : 0.1,
               scaleStartValue : 25.5, 
               fontSize: 15,
               options: {
                    legend: {
                        labels: {
                            // This more specific font property overrides the global property
                            fontColor: 'black',
                            fontSize: 20
                        }
                    }
                }
            });
            $.mobile.changePage('#GraphPage');
        })
        .catch(function(error){
                 /* 処理失敗 */
                 alert("グラフ表示でエラーが発生しました。");
                 console.log("グラフ表示でエラーが発生しました：" + error);
                 // loading の表示終了
                 $.mobile.loading('hide');
        });
        
}

/********** メールアドレス / PW 認証 **********/
// 【メール / PW 認証】「登録する」ボタン押下時の処理
function onEmailRegisterBtn() {
    // loading の表示
    $.mobile.loading('show');
    // 入力フォームからメールアドレス(mailAddress)を取得
    var mailAddress = $("#reg_mailAddress").val();
    // [NCMB] メールアドレス に会員登録を行うためのメールを送信
    ncmb.User.requestSignUpEmail(mailAddress)
             .then(function(user){
                 /* 処理成功 */
                 alert("【メール / PW 認証】新規登録メールを配信しました。");
                 console.log("【メール / PW 認証】新規登録メールを配信しました。");
                 alert("届いたメールに記載されているURLにアクセスし、パスワードを登録してください。");
                 // フィールドを空に
                 $("#reg_mailAddress").val("");
                 // loading の表示終了
                 $.mobile.loading('hide');
                 // 【メール / PW 認証】ログインページへ移動
                 $.mobile.changePage('#emailLoginPage');
             })
             .catch(function(error){
                 /* 処理失敗 */
                 alert("【メール / PW 認証】新規登録メールの配信に失敗しました。");
                 console.log("【メール / PW 認証】新規登録メールの配信失敗しました：" + error);
                 // loading の表示終了
                 $.mobile.loading('hide');
             });
}

// 【メール / PW 認証】「ログインする」ボタン押下時の処理
function onEmailLoginBtn() {
    // 入力フォームからメールアドレス(mailAddress)とPW(password)を取得
    var mailAddress = $("#login_mailAddress").val();
    var password = $("#emailLogin_password").val();
    // loading の表示
    $.mobile.loading('show');
    // [NCMB] メール / PW でログイン
    ncmb.user.loginWithMailAddress(mailAddress, password)
    //ncmb.User.loginWithMailAddress(mailAddress, password)
             .then(function(user) {
                 /* 処理成功 */
                 console.log("【メール / PW 認証】ログインに成功しました");
                 // [NCMB] ログイン中の会員情報の取得
                 currentLoginUser = ncmb.User.getCurrentUser();
                 // フィールドを空に
                 $("#login_mailAddress").val("");
                 $("#emailLogin_password").val("");
                 // 詳細ページへ移動
                 $.mobile.changePage('#DetailPage');
             })
             .catch(function(error) {
                 /* 処理失敗 */
                 console.log("【メール / PW 認証】ログインに失敗しました: " + error);
                 alert("【メール / PW 認証】ログインに失敗しました。");
                 // フィールドを空に
                 $("#login_mailAddress").val("");
                 $("#emailLogin_password").val("");
                 // loading の表示
                 $.mobile.loading('hide');
             });
}

/********** メールアドレス / PW 認証 **********/
// 【メール / PW 認証】「PWリセット」ボタン押下時の処理
function onPWresetBtn() {
    var RSTuser = new ncmb.User();
    var rstUserMail = $("#reg_mailAddress").val;
    console.log(rstUserMail);
    RSTuser.set("mailAddress", rstUserMail);
    RSTuser.requestPasswordReset()
    .then(function(data){
        // 送信後処理
        console.log("送信完了");
        alert("登録されたメールアドレスにパスワードリセットメールを送信しました。メールに記載の手順に従って再ログインください。");
        currentLoginUser = null;
        // currentUserDataリストを空に
        $("#currentUserData").empty();
        // 【ID / PW】ログインページへ移動
        $.mobile.changePage('#emailLoginPage');
    })
    .catch(function(err){
        // エラー処理
        console.log("送信失敗");
        alert("パスワードリセットメールの送信が失敗しました。メールアドレスをご確認の上再度送信ください。");
        $.mobile.changePage('#emailLoginPage');
    });
}

/********** 会員情報変更 ************/
function onMemberUpdate() {
    // currentUser.set()
    // currentUserのフィールドを更新
    // userName 
    // password 
    // mailAddress 
    // authData 
    // petName2 
    // sessionInfo 
    // petName1 
    // parentName 
    // uid_1 
    // uid_2 
    currentLoginUser = ncmb.User.getCurrentUser();
    var acl = new ncmb.Acl();
    acl.setPublicReadAccess(true); //全員への読み込み権限を許可
    acl.setPublicWriteAccess(true); //全員への書き込み権限を許可
    acl.setUserReadAccess(currentLoginUser, true);
    acl.setUserWriteAccess(currentLoginUser, true);
    currentLoginUser.set("acl",acl); // aclを設定

    currentLoginUser.set("parentName", $("#parentName").val()) /* おなまえ */
                    .set("petName1", $("#petName1").val()) /* ペット名1 */
                    .set("petName2", $("#petName2").val()) /* ペット名2 */
                    .set("uid_1", $("#uid1").val()) /* カードNo.1 */
                    .set("uid_2", $("#uid2").val()) /* カードNo.2 */
                    .update()
                    .then(function(obj) {
                        // 更新完了
                        console.log("会員情報更新完了");
                        //console.log(obj);
                        acl.setPublicReadAccess(false); //全員への読み込み権限を許可
                        acl.setPublicWriteAccess(false); //全員への書き込み権限を許可
                        acl.setUserReadAccess(currentLoginUser, true);
                        acl.setUserWriteAccess(currentLoginUser, true);
                        currentLoginUser.set("acl",acl); // aclを設定
                        currentLoginUser.update();
                        $.mobile.changePage('#DetailPage');    
                    })
                    .catch(function(error) {
                        // エラー
                        //console.log(obj);
                        console.log(error);
                    });
}

function backDetail() {
    // loading の表示
    $.mobile.loading('show');
    $("#currentUserData").empty();
    $.mobile.changePage('#DetailPage');
}
/********** 共通 **********/
// 「ログアウト」ボタン押下後確認アラートで「はい」押下時の処理
function onLogoutBtn() {  
    // [NCMB] ログアウト
    ncmb.User.logout();
    console.log("ログアウトに成功しました");
    // ログイン中の会員情報を空に
    currentLoginUser = null;
    // currentUserDataリストを空に
    $("#currentUserData").empty();
    // 【ID / PW】ログインページへ移動
    $.mobile.changePage('#emailLoginPage');
}

//---------------------------------------------------------------------------

// アプリ起動時
$(function() {
    $.mobile.defaultPageTransition = 'none';
    /* メール / PW */
    $("#emailLoginBtn").click(onEmailLoginBtn);
    $("#YesBtn_mailAddress").click(onEmailRegisterBtn);
    $("#NoBtn_mailAddress").click(onDeleteField);  
    $("#backDetailPage").click(backDetail);  
    $("#YesBtn_PWReset").click(onPWresetBtn);
    /* 共通 */
    $("#YesBtn_logout").click(onLogoutBtn);
    /* グラフ表示 */
    $("#DisplayGraphBtn").click(displayLineChart);
    /* 会員情報変更 */
    $("#yesBtn_Change").click(onMemberUpdate);
});

// loading 表示生成
$(document).on('mobileinit',function(){
    $.mobile.loader.prototype.options;
});

// DetailPage ページが表示されるたびに実行される処理
$(document).on('pageshow','#DetailPage', function(e, d) {
    // currentUserData を表示
    getUserData();
    // loading の表示を終了
    $.mobile.loading('hide');
});

// currentUser のデータを表示する処理
function getUserData() {
    // 値を取得
    var parentName = currentLoginUser.get("parentName");
    var mailAddress = currentLoginUser.get("mailAddress");
    var uid1 = currentLoginUser.get("pet1_ID");
    var uid2 = currentLoginUser.get("pet2_ID");
    var petName1 = currentLoginUser.get("petname1");
    var petName2 = currentLoginUser.get("petname2");
    var authData = JSON.stringify(currentLoginUser.get("authData"));
    var date = new Date(currentLoginUser.get("createDate"));
   /* var createDate = date.getFullYear() + "-" 
                    + ((date.getMonth() < 10) ? "0" : "") + date.getMonth() + "-"
                    + ((date.getDate() < 10) ? "0" : "") + date.getDate() + "T"
                    + ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":"
                    + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes() + ":" 
                    + ((date.getSeconds() < 10) ? "0" : "") + date.getSeconds() + "." 
                    + ((date.getMilliseconds() < 10) ? "0" : "") + date.getMilliseconds() + "+09:00";*/
    // リストに追加
    $("#currentUserData").append("<tr><th>おなまえ</th><td><input type='text' id='parentName' name='parentName' style='width:95%; height: 30px;' value='" + parentName + "'/></tr>");
    $("#currentUserData").append("<tr><th>メール</th><td><input type='text' id='loginMailAddr' name='loginMailAddr' style='width:95%; color: #959595;' readonly='readonly'; value='" + mailAddress + "'/></tr>");
    $("#currentUserData").append("<tr><th>ペット名１</th><td><input type='text' id='petName1' name='petName1' style='width:95%; height: 30px;' value='" + petName1 + "'/></tr>");
    $("#currentUserData").append("<tr><th>カードNo.1</th><td><input type='text' id='uid1' name='uid1'  style='width:95%; height: 30px;'value='" + uid1 + "'/></tr>");
    $("#currentUserData").append("<tr><th>ペット名２</th><td><input type='text' id='petName2' name='petName2' style='width:95%; height: 30px;' value='" + petName2 + "'/></tr>");
    $("#currentUserData").append("<tr><th>カードNo.2</th><td><input type='text' id='uid2' name='uid2' style='width:95%; height: 30px;' value='" + uid2 + "'/></tr>");

    // $("#currentUserData").append("<tr style='border-right: 1px solid #ccc; border-left: 1px solid #ecc; color: #FFFFFF; background: #0016ae;'><th>おなまえ</th><td><input type='text' id='parentName' name='parentName' style='width:95%; color: #959595;' value='" + parentName + "'/></tr>");
    // $("#currentUserData").append("<tr><th>メール</th><td><input type='text' id='loginMailAddr' name='loginMailAddr' style='width:95%; color: #959595;' readonly='readonly'; value='" + mailAddress + "'/></tr>");
    // $("#currentUserData").append("<tr style='border-right: 1px solid #ccc; border-left: 1px solid #ecc; color: #FFFFFF; background: #0016ae;'><th>ペット名１</th><td><input type='text' id='petName1' name='petName1' style='width:95%; height: 20px; color: #959595;' value='" + petName1 + "'/></tr>");
    // $("#currentUserData").append("<tr><th>カードNo.1</th><td><input type='text' id='uid1' name='uid1' style='width:95%; color: #959595;' value='" + uid1 + "'/></tr>");
    // $("#currentUserData").append("<tr style='border-right: 1px solid #ccc; border-left: 1px solid #ecc; color: #FFFFFF; background: #0016ae;'><th>ペット名２</th><td><input type='text' id='petName2' name='petName2' style='width:95%; height: 20px; color: #959595;' value='" + petName2 + "'/></tr>");
    // $("#currentUserData").append("<tr><th>カードNo.2</th><td><input type='text' id='uid2' name='uid2' style='width:95%; color: #959595;' value='" + uid2 + "'/></tr>");
    // リストを更新
    $("#currentUserData").listview('refresh');
}

function onDeleteField() {
    // フィールドを空に
    $("#reg_mailAddress").val("");
}
