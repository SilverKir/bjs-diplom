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

updateUserData = (data, message) => {
    if (data.success) {
        ProfileWidget.showProfile(data.data);
        moneyManager.setMessage(data.success, message);
    } else {
        moneyManager.setMessage(data.success, data.error);
    }
}

getCurrentUserData = () => {
    ApiConnector.current(userData => {
        updateUserData(userData, "Начальные данные загружены успешно")
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

updateFavoritesData = (data, message) => {
    if (data.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(data.data);
        moneyManager.updateUsersList(data.data);
        favoritesWidget.setMessage(data.success, message);
    } else {
        favoritesWidget.setMessage(data.success, data.error);
    }
}

getFavoritesData = () => {
    ApiConnector.getFavorites(favoritesData => {
        updateFavoritesData(favoritesData, "Данные загружены успешно");
    })
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

getCurrentUserData();

getCurrencyRate();

getFavoritesData();

setTimeout(() => { getCurrencyRate() }, 60000);
