const logoutButton = new LogoutButton();

const moneyManager = new MoneyManager();

const ratesBoard = new RatesBoard();

logoutButton.action = () => {
	(confirm("Подтвердите выход из личного кабинета")) ? 
	ApiConnector.logout(unswer => {(unswer)? location.reload():""}):
    ""}

updateData = () =>{
    ApiConnector.current(userData => {
        (userData.success) ?
        ProfileWidget.showProfile(userData.data):
        moneyManager.setMessage(userData.success, userData.error)
    })
}

 getCurrencyRate = () => {
    ApiConnector.getStocks(currencyRate => {
        if (currencyRate.success){
            ratesBoard.clearTable();
            ratesBoard.fillTable(currencyRate.data);  
        }
    })
}

updateUserData = (data, message, delay) => {
    if (data.success){
        setTimeout(() => {updateData()},delay);
        moneyManager.setMessage(data.success, message); 
    } else {
       moneyManager.setMessage(data.success, data.error); 
    }  
}

updateData();

getCurrencyRate();

setTimeout(() => {getCurrencyRate()},60000);


 moneyManager.addMoneyCallback = data =>{
    ApiConnector.addMoney(data, callback =>{
        updateUserData(callback,"Пополнение выполнено успешно", 7000)
    })
 }

 moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, callback =>{
        updateUserData(callback,"Конвертация выполнена успешно", 7000)
    })
 }

 moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, callback =>{
        console.log(callback)
        updateUserData(callback,"Перевод выполнен успешно", 7000)
    })
 }
