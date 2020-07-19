/*
* @Author: 元实
* @Date:   2019-10-11
* @Description: '树结构数据表格'
*/

<template>
    <!--<table
        cellspacing="0"
        cellpadding="0"
        border="0"
    >
        <thead>
            <tr>
                <th v-for="(columnName, index) in props.levelNames" :key="columnName + index">{{ columnName }}</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="item in tableData">
                <td></td>
            </tr>
        </tbody>
    </table>-->
    <el-table
        :data="tableData"
        class="table"
        style="width: 100%">
        <el-table-column
            v-for="(columnName, idx) in props.levelNames"
            :key="columnName + idx"
            :label="columnName"
        ></el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: 'TheLevelTable',

        props: {
            data: Array, //树结构数据
            props: {  //树结构数据转换属性
                type: Object,
                validator(value) {
                    if (!(value.children && value.label && value.levelNames)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        },

        data() {
            return {
                tableData: []
            }
        },

        updated() {
            this.convertData();
        },

        methods: {
            /**
             * 把原来的数据结构转换成组件使用的数据结构
             */
            convertData() {
                let data = this.data;
                let qnty = data.length;
                let result = [];
                console.log('---', this.data);

                for (let i = 0; i < qnty; i++) {
                    let rows = [];

                    console.log('i = ', i);
                    rows = this.setDataRows(0, data[i]);
                    result.concat(rows);
                    console.log(rows, result);
                }

            },

            setDataRows(index, data, row = {}, rows = []) {
                const childrenProp = this.props.children;
                const children = data[childrenProp];

                if (!children.length) {
                    row['privileges'] = data[this.props.label];
                    console.log('leaves', row, rows);
                    rows.push(row);
                    return rows;
                } else {
                    let childrenQnty = children.length;

                    row['level' + index] = data[this.props.label];
                    for (let i = 0; i < childrenQnty; i++) {
                        this.setDataRows(index + 1, children[i], row, rows);
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    .table {
        width: 100%;
        font-size: 14px!important;
        border: 1px solid #E1E5E8;
        color: #324057!important;
        border-radius: 4px;

        &:before {
            height: 0px!important;
        }

        th {
            border-right: 0px!important;
            background: rgba(249,250,252,1)!important;
            height: 35px;

            div {
                background: rgba(249,250,252,1);
                font-size: 14px!important;
                color: #8D9BA4;
                font-weight: 500;

                .el-table__column-filter-trigger {
                    line-height: 40px!important;
                }
            }

            &.is-leaf {
                border-bottom: 1px solid #E1E5E8;
            }
        }

        td {
            height: 40px!important;
            padding: 0px!important;
            border-bottom: 1px solid #E1E5E8;
        }

        tr:last-child td {
            border-bottom: none;
        }
    }
</style>
