"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var planning_service_ts_1 = require("../lib/services/planning-service.ts");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var years, _i, years_1, year, i, planData, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                years = [2023, 2024, 2025];
                _i = 0, years_1 = years;
                _a.label = 1;
            case 1:
                if (!(_i < years_1.length)) return [3 /*break*/, 8];
                year = years_1[_i];
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < 30)) return [3 /*break*/, 7];
                planData = {
                    year: year,
                    unit: (Math.floor(Math.random() * 10) + 1).toString(), // 1-10
                    startDate: "".concat(year, "-01-01"),
                    endDate: "".concat(year, "-12-31"),
                    responsible: (Math.floor(Math.random() * 20) + 1).toString(), // 1-20
                    incomingNumber: "IN-".concat(year, "-").concat(i + 1, "-").concat(Math.random().toString(36).substring(2, 6).toUpperCase()),
                    incomingDate: "".concat(year, "-").concat(String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0'), "-").concat(String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')),
                    objectsTotal: Math.floor(Math.random() * 16) + 5,
                    objectsFS: Math.floor(Math.random() * 6),
                    objectsOS: Math.floor(Math.random() * 6),
                    expenseClassification: "EC-".concat(Math.random().toString(36).substring(2, 6).toUpperCase()),
                    supplyDepartment: "SD-".concat(Math.random().toString(36).substring(2, 6).toUpperCase()),
                    controlAuthority: "CA-".concat(Math.random().toString(36).substring(2, 6).toUpperCase()),
                    controlObject: "CO-".concat(Math.random().toString(36).substring(2, 6).toUpperCase()),
                    inspectionDirection: Math.floor(Math.random() * 5) + 1,
                    inspectionType: Math.floor(Math.random() * 3) + 1,
                };
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, planning_service_ts_1.planningService.createAnnualPlan(planData)];
            case 4:
                _a.sent();
                console.log("\u2705 created ".concat(i + 1, "/").concat(30, " for ").concat(year));
                return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                console.error('❌ error creating plan', e_1);
                return [3 /*break*/, 6];
            case 6:
                i++;
                return [3 /*break*/, 2];
            case 7:
                _i++;
                return [3 /*break*/, 1];
            case 8:
                console.log('✅ seed finished');
                return [2 /*return*/];
        }
    });
}); })();
