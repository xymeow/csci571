//
//  ViewController.swift
//  searchPlace
//
//  Created by Xiaoyi He on 9/4/18.
//  Copyright © 2018 Xiaoyi He. All rights reserved.
//

import UIKit
import McPicker
import GooglePlaces
import CoreLocation
import EasyToast
import Alamofire
import SwiftSpinner


struct GeoJson {
    var lat: Float
    var lng: Float
    
    init() {
        lat = 0
        lng = 0
    }
    mutating func setLatLng(lat: Float, lng:Float) {
        self.lat = lat
        self.lng = lng
    }
}



class ViewController: UIViewController, UITextFieldDelegate, CLLocationManagerDelegate, UITableViewDelegate, UITableViewDataSource {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.favCount
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell: ResultCell = self.favoriteTableView.dequeueReusableCell(withIdentifier: "favoriteCell") as! ResultCell else {
            fatalError("The dequeued cell is not an instance of reviewcell")
        }
        return cell
    }
    
    var placeClient: GMSPlacesClient!
    var locationManager: CLLocationManager!
    var myplace = GeoJson()
    var jsonData: Any?
    var userDefault = UserDefaults.standard
    var favCount: Int = 0
    //MARK: Properties
    
    @IBOutlet weak var keywordField: UITextField!
    
    @IBOutlet weak var categoryField: McTextField!
    @IBOutlet weak var locationField: UITextField!
    @IBOutlet weak var distanceField: UITextField!
    @IBOutlet weak var searchButton: UIButton!
    @IBOutlet weak var clearButton: UIButton!
    
    @IBOutlet weak var favSegmentControl: UISegmentedControl!
    @IBOutlet weak var favoriteTableView: UITableView!
    var autocompleteController = GMSAutocompleteViewController()
    
    func loadFavorites() {
        let favStored = userDefault.dictionaryRepresentation()
//        self.favCount = favStored.count
        print(favStored)
    }
    
    @objc func segmentControl(segment: UISegmentedControl) {
        if segment.selectedSegmentIndex == 1 {
            loadFavorites()
            favoriteTableView.alpha = 1
        }
        else {
            favoriteTableView.alpha = 0
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = "Place Search"
        // Do any additional setup after loading the view, typically from a nib.
        keywordField.delegate = self
        locationField.delegate = self
        categoryField.delegate = self
        distanceField.delegate = self
        autocompleteController.delegate = self
        locationManager = CLLocationManager()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestAlwaysAuthorization()
        locationManager.startUpdatingLocation()
        placeClient = GMSPlacesClient.shared()
        self.view.toastBackgroundColor = UIColor.black.withAlphaComponent(0.7)
        self.view.toastTextColor = UIColor.white
        
        let categories: [[String]] = [[
            "Default",
            "Airport",
            "Amusement Park",
            "Aquarium",
            "Art Gallery",
            "Bakery",
            "Bar",
            "Beauty Salon",
            "Bowling Alley",
            "Bus Station",
            "Cafe",
            "Campground",
            "Car Rental",
            "Casino",
            "Lodging",
            "Movie Theater",
            "Museum",
            "Night Club",
            "Park",
            "Parking",
            "Restaurant",
            "Shopping Mall",
            "Stadium",
            "Subway Station",
            "Taxi Stand",
            "Train Station",
            "Transit Station",
            "Travel Agency",
            "Zoo"
            ]]
        let mcInputView = McPicker(data: categories)
        categoryField.inputViewMcPicker = mcInputView
        
        
        categoryField.doneHandler = {[weak categoryField] (selections) in categoryField?.text = selections[0]!}
        categoryField.selectionChangedHandler = {[weak categoryField] (selections, componentChanged) in categoryField?.text = selections[componentChanged]!}
        //categoryField.cancelHandler = {[weak categoryField] in categoryField?.text = ""}
        categoryField.textFieldWillBeginEditingHandler = {[weak categoryField] (selections) in
            if categoryField?.text == "" {
                categoryField?.text = selections[0]
            }
        }
        
        favSegmentControl.addTarget(self, action: #selector(segmentControl), for: .valueChanged)
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let location:CLLocationCoordinate2D = manager.location!.coordinate
        myplace.setLatLng(lat: Float(location.latitude), lng: Float(location.longitude))
        print("location= \(location.latitude), \(location.longitude)")
        print("myloc= \(myplace.lat), \(myplace.lng)")
    }
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    //MARK: delegate
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        print(textField.text)
        return true
    }
    
    @IBAction func locationAutoComplete() {
        present(autocompleteController, animated: true, completion: nil)
    }
    
    //MARK: Actions
    
    
    @IBAction func search(_ sender: UIButton) {
        print(keywordField.text)
        if (keywordField.text?.trimmingCharacters(in: .whitespaces).isEmpty)! {
//            print("keyword error")
            self.view.showToast("keyword can not be empty!", position: .bottom, popTime: 2, dismissOnTap: false)
            return
        }
        if (locationField.text?.trimmingCharacters(in: .whitespaces).isEmpty)! {
//            print("location error")
            self.view.showToast("location can not be empty!", position: .bottom, popTime: 2, dismissOnTap: false)
            return
        }
        var distance = "10"
        var isUserInput = "false"
        if distanceField.text != "" {
            distance = distanceField.text!
            if let check = Float(distance) {
            }
            else {
                self.view.showToast("distance should be number!", position: .bottom, popTime: 2, dismissOnTap: false)
                return
            }
        }
        if locationField.text != "Your location" {
            isUserInput = "true"
        }
        print(myplace)
        let keyword: String = keywordField.text!
        let category: String = categoryField.text!
        let location: String = locationField.text!
//        print(keywordField.text, categoryField.text, distanceField.text, locationField.text)
        let params: Parameters = [
            "keyword": keyword,
            "category": category,
            "distance": distance,
            "isUserInput": isUserInput,
            "location": location,
//            "geoJson": "{lat: \(myplace.lat), lng: \(myplace.lng)}"
            "geoJson": ["lat": myplace.lat, "lng": myplace.lng]
        ]
        SwiftSpinner.show("Loading")
        Alamofire.request("http://localhost:8081/api/search", parameters: params).responseJSON {response in
            switch response.result {
            case .success: do {
                print("success")
                self.jsonData = response.result.value 
//                print(self.jsonData)
                
                self.myPerformSurge(identifier: "showResult")
                SwiftSpinner.hide()
            }
            case .failure(let error):
                print("error")
            }
        }
//        performSegue(withIdentifier: "showResult", sender: self)
    }
    
    private func myPerformSurge(identifier: String) {
        performSegue(withIdentifier: identifier, sender: self)
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let resultVC: ResultViewController = segue.destination as! ResultViewController
        resultVC.data = self.jsonData as AnyObject
    }
    
    
    @IBAction func clear(_ sender: UIButton) {
        categoryField.text = "Default"
        keywordField.text = ""
        distanceField.text = ""
        locationField.text = "Your location"
        
    }
    
    
    
}
//MARK: Google place autocomplete
extension ViewController: GMSAutocompleteViewControllerDelegate {
    
    // Handle the user's selection.
    func viewController(_ viewController: GMSAutocompleteViewController, didAutocompleteWith place: GMSPlace) {
        self.locationField.text =  "\(place.name), \(String(describing: place.formattedAddress!))"
        dismiss(animated: true, completion: nil)
    }
    
    func viewController(_ viewController: GMSAutocompleteViewController, didFailAutocompleteWithError error: Error) {
        // TODO: handle the error.
        print("Error: ", error.localizedDescription)
    }
    
    // User canceled the operation.
    func wasCancelled(_ viewController: GMSAutocompleteViewController) {
        dismiss(animated: true, completion: nil)
    }
    
    // Turn the network activity indicator on and off again.
    func didRequestAutocompletePredictions(_ viewController: GMSAutocompleteViewController) {
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
    }
    
    func didUpdateAutocompletePredictions(_ viewController: GMSAutocompleteViewController) {
        UIApplication.shared.isNetworkActivityIndicatorVisible = false
    }
    
}


