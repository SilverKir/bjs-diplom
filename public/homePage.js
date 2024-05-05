const logoutButton = new LogoutButton();

const moneyManager = new MoneyManager();

const ratesBoard = new RatesBoard();

const favoritesWidget = new FavoritesWidget();

logoutButton.action = () => {
    (confirm("Подтвердите выход из личного кабинета")) ?
        ApiConnector.logout(unswer => { (unswer) ? location.reload() : "" }) :
        ""
}

updateData = () => {
    ApiConnector.current(userData => {
        (userData.success) ?
            ProfileWidget.showProfile(userData.data) :
            moneyManager.setMessage(userData.success, userData.error)
    })
}

getCurrencyRate = () => {
    ApiConnector.getStocks(currencyRate => {
        if (currencyRate.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(currencyRate.data);
        }
    })
}

updateUserData = (data, message, delay) => {
    if (data.success) {
        setTimeout(() => { updateData() }, delay);
        moneyManager.setMessage(data.success, message);
    } else {
        moneyManager.setMessage(data.success, data.error);
    }
}

moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, callback => {
        updateUserData(callback, "Пополнение счета на " + data.amount + " " + data.currency + " выполнено успешно", 7000)
    })
}

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, callback => {
        updateUserData(callback, "Конвертация " + data.fromAmount + " " + data.fromCurrency + " в " + data.targetCurrency + " выполнена успешно", 7000)
    })
}

moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, callback => {
        updateUserData(callback, "Перевод выполнен успешно", 7000)
    })
}

getFavoritesData = () => {
    ApiConnector.getFavorites(favoritesData => {
        if (favoritesData.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(favoritesData.data);
            moneyManager.updateUsersList(favoritesData.data);
        }
    })
}

updateFavoritesData = (data, message) => {
    if (data.success) {
        favoritesWidget.setMessage(data.success, message);
        getFavoritesData();
    } else {
        favoritesWidget.setMessage(data.success, data.error);
    }
}

favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, callback => {
        updateFavoritesData(callback, data.name + " добавлен в избранное");
    })
}

favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, callback => {
        updateFavoritesData(callback, "Удаление успешно выполнено");
    })
}

updateData();

getCurrencyRate();

getFavoritesData();

setTimeout(() => { getCurrencyRate() }, 60000);
