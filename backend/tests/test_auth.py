def test_login_success(client):
    response = client.post(
        "/api/v1/teachers/login",
        data={ 
            "username": "admin",
            "password": "admin123"
        }
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(client):
    response = client.post(
        "/api/v1/teachers/login",
        data={
            "username": "teacher1",
            "password": "1234asd1e"
        }
    )
    assert response.status_code == 401