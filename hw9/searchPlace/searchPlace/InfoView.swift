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
    var infoData: AnyObject?
    
    @IBOutlet weak var phoneNumber: UITextView!
    @IBOutlet weak var address: UILabel!
    @IBOutlet weak var priceLevel: UILabel!
    @IBOutlet weak var rating: CosmosView!
    @IBOutlet weak var website: UITextView!
    @IBOutlet weak var ggPage: UITextView!

    override func viewDidLoad() {
        super.viewDidLoad()
        print(infoData)
        let title = infoData!["name"] as! String
        self.rating.settings.updateOnTouch = false
        self.rating.rating = Double(infoData!["rating"] as! Float)
        self.address.text = infoData!["vicinity"] as! String
        self.phoneNumber.text = infoData!["international_phone_number"] as! String
        self.website.text = infoData!["website"] as! String
        self.ggPage.text = infoData!["url"] as! String
        self.priceLevel.text = priceLvlMap[infoData?["price_level"] as! Int]
    }

    private var priceLvlMap = ["", "$", "$$", "$$$", "$$$$", "$$$$$"]
    

}

