package main

import (
	beegoLogs "github.com/beego/beego/v2/core/logs"
	"github.com/beego/beego/v2/server/web"
	auto "simple_message/auto"
	_ "simple_message/controllers"
	. "simple_message/utils"
)

func main() {

	ConnectDB("dsn", "dbDriverName")
	AutoMigrate("autoMigrate", auto.AutoMigrateDbList)
	beegoLogs.SetLevel(beegoLogs.LevelDebug)
	web.Run()
}
