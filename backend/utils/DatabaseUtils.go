package utils

import (
	"errors"
	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

var Db *gorm.DB
func GetDb( newDb... *gorm.DB) *gorm.DB{
	if(newDb != nil){
		return newDb[0]
	}
	return Db
}

func makeDialector(dbType string,dbUrl string)(gorm.Dialector,error){
	switch dbType {
	case "mysql":
		{
			return mysql.Open(dbUrl),nil
		}
	case "sqlite":
		{
			return sqlite.Open(dbUrl),nil
		}
	case "postgres":
		{
			return postgres.Open(dbUrl),nil
		}
	default:
		return nil,errors.New("unsupported driver")
	}

}
func ConnectDB(dsnVarName string,dbDriverVarName string)  {
	var dsn string
	var err error
	var dbDriverName string
	if dsn = GetConfig().String(dsnVarName,"");dsn == "" {
		Logger.Error(err.Error())
		return
	}
	if dbDriverName = GetConfig().String(dbDriverVarName,"");dbDriverName == "" {
		Logger.Error(err.Error())
		return
	}
	logLevel := logger.Warn
	if dbDebug := GetConfig().Bool("dbDebug",false);dbDebug == true {
		logLevel = logger.Info
	}
	var dialector gorm.Dialector
	if dialector,err = makeDialector(dbDriverName,dsn);err != nil {
		Logger.Error(err.Error())
		return
	}
	config := gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			TablePrefix: "",   // table name prefix, table for `User` would be `t_users`
			SingularTable: true, // use singular table name, table for `User` would be `user` with this option enabled
			NoLowerCase: false, // skip the snake_casing of names
			NameReplacer: nil,//strings.NewReplacer("CID", "Cid"), // use name replacer to change struct/field name before convert it to db name
		},
		Logger:logger.Default.LogMode(logLevel),
	}
	if Db,err = gorm.Open(dialector,&config);err != nil {
		Logger.Error(err.Error())
		return
	}
}
func AutoMigrate(autoBuildDbVarName string,dst []interface{}) {
	var auotBuild string
	if auotBuild = GetConfig().String(autoBuildDbVarName,"false");auotBuild != "auto" {
		Logger.Info("跳过自动创建")
		return
	}
	for _,model := range dst {
		GetDb().AutoMigrate(model)
	}
}