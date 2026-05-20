import requests
import sys
import json
from datetime import datetime

class WeatherAPITester:
    def __init__(self, base_url="https://clima-minimal.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, params=None, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=15)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=15)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=15)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'List with ' + str(len(response_data)) + ' items'}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            self.test_results.append({
                "test": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_preview": response.text[:100] if not success else "OK"
            })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "test": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "success": False,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        if success:
            print(f"   API Key configured: {response.get('api_key_configured', 'Unknown')}")
        return success

    def test_current_weather_by_coords(self):
        """Test current weather with coordinates (London)"""
        success, response = self.run_test(
            "Current Weather by Coordinates",
            "GET",
            "weather/current",
            200,
            params={"lat": 51.5074, "lon": -0.1278}
        )
        if success and 'main' in response:
            print(f"   Temperature: {response['main']['temp']}°C")
            print(f"   Humidity: {response['main']['humidity']}%")
            print(f"   Wind Speed: {response['wind']['speed']} m/s")
        return success

    def test_current_weather_by_city(self):
        """Test current weather with city name"""
        success, response = self.run_test(
            "Current Weather by City",
            "GET",
            "weather/current",
            200,
            params={"city": "London"}
        )
        if success and 'main' in response:
            print(f"   City: {response.get('name', 'Unknown')}")
            print(f"   Temperature: {response['main']['temp']}°C")
        return success

    def test_forecast(self):
        """Test weather forecast"""
        success, response = self.run_test(
            "Weather Forecast",
            "GET",
            "weather/forecast",
            200,
            params={"lat": 51.5074, "lon": -0.1278}
        )
        if success and 'list' in response:
            print(f"   Forecast items: {len(response['list'])}")
        return success

    def test_air_quality(self):
        """Test air quality data"""
        success, response = self.run_test(
            "Air Quality",
            "GET",
            "weather/air-quality",
            200,
            params={"lat": 51.5074, "lon": -0.1278}
        )
        if success and 'list' in response:
            aqi = response['list'][0]['main']['aqi'] if response['list'] else 'Unknown'
            print(f"   AQI: {aqi}")
        return success

    def test_geocode(self):
        """Test city geocoding"""
        success, response = self.run_test(
            "Geocode City",
            "GET",
            "weather/geocode",
            200,
            params={"q": "Paris"}
        )
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} cities")
            print(f"   First result: {response[0].get('name', 'Unknown')}, {response[0].get('country', 'Unknown')}")
        return success

    def test_favorites_crud(self):
        """Test favorites CRUD operations"""
        # First, get existing favorites
        success, favorites = self.run_test(
            "Get Favorites",
            "GET",
            "favorites",
            200
        )
        if not success:
            return False

        print(f"   Existing favorites: {len(favorites)}")

        # Add a favorite
        test_city = {
            "city_name": "Test City",
            "lat": 40.7128,
            "lon": -74.0060,
            "country": "US"
        }
        
        success, new_fav = self.run_test(
            "Add Favorite",
            "POST",
            "favorites",
            200,
            data=test_city
        )
        if not success:
            return False

        favorite_id = new_fav.get('id')
        print(f"   Added favorite with ID: {favorite_id}")

        # Delete the favorite
        if favorite_id:
            success, _ = self.run_test(
                "Delete Favorite",
                "DELETE",
                f"favorites/{favorite_id}",
                200
            )
            if success:
                print(f"   Successfully deleted favorite")
            return success
        
        return False

def main():
    print("🌤️  Weather API Testing Suite")
    print("=" * 50)
    
    # Setup
    tester = WeatherAPITester()
    
    # Run all tests
    tests = [
        tester.test_root_endpoint,
        tester.test_current_weather_by_coords,
        tester.test_current_weather_by_city,
        tester.test_forecast,
        tester.test_air_quality,
        tester.test_geocode,
        tester.test_favorites_crud
    ]
    
    for test in tests:
        test()
    
    # Print summary
    print(f"\n📊 Test Summary")
    print("=" * 50)
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Print failed tests
    failed_tests = [r for r in tester.test_results if not r['success']]
    if failed_tests:
        print(f"\n❌ Failed Tests:")
        for test in failed_tests:
            error_msg = test.get('error', f'Status {test["actual_status"]}')
            print(f"   - {test['test']}: {error_msg}")
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'summary': {
                'total_tests': tester.tests_run,
                'passed_tests': tester.tests_passed,
                'success_rate': (tester.tests_passed/tester.tests_run)*100,
                'timestamp': datetime.now().isoformat()
            },
            'test_results': tester.test_results
        }, f, indent=2)
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())