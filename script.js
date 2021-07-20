let elements = []
class Attribute {
    constructor (name, json){
        this.name = name
        this.properties = {}
        for (let [attribute, type] of Object.entries(json)){
            if (type.__proto__.constructor == Array){
                type = type[0]
            }
            if (atomic.includes(type)){
                this.properties[attribute] = type
            } else {
                this.properties[attribute] = new Attribute(type.name,type.properties)
            }
        }
    }
    input(){
        return Object.keys(this.properties).map(property => atomic.includes(this.properties[property]) ? `<input name="${property}" type="${this.properties[property].name}">` : `<div>${this.properties[property].input()}</div>`).join("<br>")
    }
}
class Resource extends Attribute {
    constructor(json){
        super(json.Type, json.Properties)
    }
}
let Integer = new Attribute("Integer",{})
const atomic = [String, Boolean, Integer]

Code = new Attribute("Code",{
    "ImageUri" : String,
    "S3Bucket" : String,
    "S3Key" : String,
    "S3ObjectVersion" : String,
    "ZipFile" : String
})
let Lambda_Function = new Resource({
    "Type" : "AWS::Lambda::Function",
    "Properties" : {
        "Code" : Code,
        "CodeSigningConfigArn" : String,
        "MemorySize" : Integer,
        "PackageType" : String,
        "ReservedConcurrentExecutions" : Integer,
        "Role" : String,
        "Runtime" : String,
      }
  })
AccelerateConfiguration = new Attribute("AccelerateConfiguration",{
    "AccelerationStatus" : String
  })

let S3_Bucket = new Resource({
    "Type" : "AWS::S3::Bucket",
    "Properties" : {
        "AccelerateConfiguration" : AccelerateConfiguration,
        "AccessControl" : String,
        "ObjectLockEnabled" : Boolean,
        "Tags" : [ String ],
      }
  })

let resources = [S3_Bucket, Lambda_Function]
window.onload = function (){
    $("body").append(`<select>${resources.map(resource => `<option value="${resource.name}">${resource.name}</option>`).join("")}</select>`)
}