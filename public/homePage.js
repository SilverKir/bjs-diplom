const logoutButton = new LogoutButton();

const moneyManager = new MoneyManager();

const ratesBoard = new RatesBoard();

const favoritesWidget = new FavoritesWidget();

logoutButton.action = () => {
    if (confirm("Подтвердите выход из личного кабинета")) {
        ApiConnector.logout(response => {
            if (response) {
                location.reload()
            }
        })
    }
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

updateUserData = (data, message) => {
    if (data.success) {
        updateData();
        moneyManager.setMessage(data.success, message);
    } else {
        moneyManager.setMessage(data.success, data.error);
    }
}

moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        updateUserData(response, "Пополнение счета на " + data.amount + " " + data.currency + " выполнено успешно")
    })
}

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        updateUserData(response, "Конвертация " + data.fromAmount + " " + data.fromCurrency + " в " + data.targetCurrency + " выполнена успешно")
    })
}

moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        updateUserData(response, "Перевод выполнен успешно")
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
    ApiConnector.addUserToFavorites(data, response => {
        updateFavoritesData(response, data.name + " добавлен в избранное");
    })
}

favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        updateFavoritesData(response, "Удаление успешно выполнено");
    })
}

updateData();

getCurrencyRate();

getFavoritesData();

setTimeout(() => { getCurrencyRate() }, 60000);
