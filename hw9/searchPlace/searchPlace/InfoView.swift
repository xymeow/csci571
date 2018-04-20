//
//  InfoView.swift
//  searchPlace
//
//  Created by Xiaoyi He on 11/4/18.
//  Copyright © 2018 Xiaoyi He. All rights reserved.
//

import Foundation
import UIKit
import Cosmos

class InfoView: UIViewController {
    var infoData: [String: Any]?
    
    @IBOutlet weak var phoneNumber: UITextView!
    @IBOutlet weak var address: UILabel!
    @IBOutlet weak var priceLevel: UILabel!
    @IBOutlet weak var rating: CosmosView!
    @IBOutlet weak var website: UITextView!
    @IBOutlet weak var ggPage: UITextView!

    override func viewDidLoad() {
        super.viewDidLoad()
        print(infoData)
        let noResult = "No result"
        let title = infoData!["name"] as! String
        self.rating.settings.updateOnTouch = false
        if infoData!["rating"] != nil {
            print(infoData!["rating"] == nil)
            self.rating.rating = Double(infoData!["rating"] as! Float)
        }
        else {
            self.rating.text = noResult
        }
        
        if infoData!["vicinity"] != nil {
            self.address.text = infoData!["vicinity"] as! String
        }
        else {
            self.address.text = noResult
        }
        
        if infoData!["international_phone_number"] != nil {
            self.phoneNumber.text = infoData!["international_phone_number"] as! String
        }
        else {
            self.phoneNumber.text = noResult
        }
        
        if infoData!["website"] != nil {
            self.website.text = infoData!["website"] as! String
        }
        else {
            self.website.text = noResult
        }
        
        if infoData!["url"] != nil {
            self.ggPage.text = infoData!["url"] as! String
        }
        else {
            self.ggPage.text = noResult
        }
        
        if infoData! ["price_level"] != nil {
            self.priceLevel.text = priceLvlMap[infoData! ["price_level"] as! Int]
        }
        else {
            self.priceLevel.text = noResult
        }
        
    }

    private var priceLvlMap = ["", "$", "$$", "$$$", "$$$$", "$$$$$"]
    

}

