//
//  SafariExtensionViewController.swift
//  MindBook Extension
//
//  Created by Sean Wu on 2019/7/14.
//  Copyright © 2019 DT42. All rights reserved.
//

import SafariServices

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width:320, height:240)
        return shared
    }()
    
    var keywordData: [Int:[String:Any]] = [:]
    
    @IBOutlet weak var keywordTableView: NSTableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        keywordTableView.delegate = self
        keywordTableView.dataSource = self
    }
    
    override func viewDidAppear() {
        super.viewDidAppear()
        loadKeywordData()
    }
    
    func loadKeywordData() {
        keywordData = [:]
        let kwcounter = userDefaults?.integer(forKey: "kwcounter") ?? 0
        for key in 0..<kwcounter {
            keywordData[key] = userDefaults?.dictionary(forKey: String(key))
        }
        NSLog("Loaded: \(keywordData)")
        keywordTableView.reloadData()
    }
    
    @IBAction func clearKeywordData(_ sender: NSButton) {
        userDefaults?.removePersistentDomain(forName: groupName)
        userDefaults?.synchronize()
        keywordData = [:]
        keywordTableView.reloadData()
    }
}

extension SafariExtensionViewController: NSTableViewDataSource, NSTableViewDelegate {

    func numberOfRows(in tableView: NSTableView) -> Int {
        return keywordData.count
    }
    
    func tableView(_ tableView: NSTableView, viewFor tableColumn: NSTableColumn?, row: Int) -> NSView? {
        let item = keywordData[row]
        guard let cell = tableView.makeView(withIdentifier: tableColumn!.identifier, owner: self) as? NSTableCellView else {
            return nil
        }
        cell.textField?.stringValue = item?[tableColumn!.identifier.rawValue] as! String
        return cell
    }
}
