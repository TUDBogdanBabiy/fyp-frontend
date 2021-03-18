<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        id="attractions__table"
        :loading="loading"
        :data="attractions"
        :columns="columns"
        :filter="filter"
      >
        <template v-slot:top-left>
          <q-input
            borderless
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:top-right>
          <q-btn
            id="add__attraction__btn"
            icon="add"
            color="primary"
            :disable="loading"
            label="Add Attraction"
            @click="
              (isEdit = false), (form = { time_slots: [] }), (showForm = true)
            "
          />
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="{ row }">
          <q-tr>
            <q-td key="title">
              {{ row.title }}
            </q-td>
            <q-td key="description">
              {{ row.description }}
            </q-td>
            <q-td key="price"> {{ row.price }} </q-td>
            <q-td key="status">
              <q-badge :color="row.status | statusColor">
                {{ row.status }}
              </q-badge>
            </q-td>
            <q-td key="actions" style="width:5px;padding-right:0">
              <q-btn-dropdown
                id="actions__dropdown"
                flat
                dropdown-icon="more_vert"
                color="primary"
                ><q-list>
                  <q-item
                    id="edit__item"
                    clickable
                    v-close-popup
                    @click="initEditForm(row)"
                  >
                    <q-item-section>
                      <q-icon color="primary" name="mode_edit" size="20px" />
                      <q-item-label class="text-primary">Edit</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    id="delete__item"
                    clickable
                    @click="showDeleteDialog = true"
                  >
                    <q-item-section>
                      <q-icon color="negative" name="delete" size="20px" />
                      <q-item-label class="text-negative">Delete</q-item-label>
                      <q-dialog v-model="showDeleteDialog" persistent>
                        <q-card id="delete_attraction__dialog">
                          <q-card-section class="row items-center">
                            <q-avatar
                              icon="delete"
                              color="negative"
                              text-color="white"
                            />
                            <span class="q-ml-sm"
                              >Are you sure you want to delete
                              {{ row.title }}?</span
                            >
                          </q-card-section>

                          <q-card-actions align="right">
                            <q-btn
                              flat
                              label="Cancel"
                              color="grey"
                              @click="showDeleteDialog = false"
                            />
                            <q-btn
                              @click="removeItem(row)"
                              flat
                              label="Delete"
                              color="negative"
                              v-close-popup
                            />
                          </q-card-actions>
                        </q-card>
                      </q-dialog>
                    </q-item-section>
                  </q-item>
                  <q-item
                    id="open__close__item"
                    clickable
                    @click="toggleAttractionStatus(row)"
                  >
                    <q-item-section>
                      <q-icon
                        :color="row.status == 'open' ? 'accent' : 'green'"
                        :name="
                          row.status == 'open'
                            ? 'no_meeting_room'
                            : 'meeting_room'
                        "
                        size="20px"
                      />
                      <q-item-label
                        :class="
                          row.status == 'open' ? 'text-accent' : 'text-green'
                        "
                        >{{
                          row.status == "open" ? "Close" : "Open"
                        }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list></q-btn-dropdown
              >
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-dialog id="attractions__form" v-model="showForm" persistent>
        <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
          <q-card-section id="form__heading" class="text-h5 text-primary">
            {{ isEdit ? `Edit ${form.title}` : "New Attraction" }}
          </q-card-section>

          <q-card-section>
            <q-input
              v-if="!isEdit"
              class="q-mb-sm"
              outlined
              dense
              v-model="form.title"
              label="Title *"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Required']"
            />
            <q-input
              class="q-mb-sm"
              outlined
              dense
              v-model="form.description"
              type="textarea"
              label="Description *"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Required']"
            />
            <div class="row justify-between">
              <q-input
                class="q-mb-sm col-md"
                outlined
                dense
                type="number"
                v-model="form.price"
                label="Price *"
                ><template v-slot:prepend>
                  <q-icon name="euro_symbol"></q-icon> </template
              ></q-input>
              <q-input
                class="q-mb-sm col-md col-xs-12 q-px-md-sm"
                outlined
                dense
                type="number"
                v-model="form.max_customers"
                label="Max Customers"
              />
              <q-input
                class="q-mb-sm col-md"
                outlined
                dense
                type="number"
                v-model="form.max_weight"
                label="Max Weight"
                ><template v-slot:append>
                  Kg
                </template></q-input
              >
            </div>
            <div class="row">
              <q-input
                class="q-mb-sm col-md"
                outlined
                dense
                type="number"
                v-model="form.min_height"
                label="Min Height"
                ><template v-slot:append>
                  cm
                </template></q-input
              >
              <q-input
                class="q-mb-sm col-md col-xs-12 q-pl-md-sm"
                outlined
                dense
                type="number"
                v-model="form.min_age"
                label="Min Age"
              />
            </div>

            <div class="row">
              <q-input
                class="col-md"
                outlined
                dense
                label="Opening Time"
                v-model="form.opening_time"
                mask="time"
                :rules="['time']"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time format24h v-model="form.opening_time">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                class="col-md q-pl-md-sm"
                outlined
                dense
                label="Closing Time"
                v-model="form.closing_time"
                mask="time"
                :rules="['time']"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time format24h v-model="form.closing_time">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-h5 q-mb-sm">Timeslots</div>
            <div class="row">
              <q-input
                v-model="slotDuration"
                class="q-mb-md"
                label="Slot duration"
                type="number"
                outlined
                dense
              >
              </q-input>
              <q-btn
                id="generate_timeslots__btn"
                class="q-mb-md q-ml-sm-sm"
                label="Auto Generate"
                color="primary"
                :disable="
                  !(form.opening_time && form.closing_time && slotDuration)
                "
                @click="generateTimeslots()"
              ></q-btn>
              <q-btn
                class="q-mb-md q-ml-sm-sm"
                label="Clear Timeslots"
                color="negative"
                @click="form.time_slots = []"
              ></q-btn>
            </div>

            <div
              class="row justify-between"
              v-for="(slot, index) in form.time_slots"
              :key="index"
            >
              <div class="col-md-5">
                <q-input
                  outlined
                  dense
                  label="Start Time"
                  v-model="slot.start_time"
                  mask="time"
                  :rules="['time']"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time format24h v-model="slot.start_time">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-md-5">
                <q-input
                  class="q-mx-md-sm"
                  outlined
                  dense
                  label="End Time"
                  v-model="slot.end_time"
                  mask="time"
                  :rules="['time']"
                >
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time format24h v-model="slot.end_time">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-md-2">
                <q-btn
                  @click="removeTimeslot(index)"
                  class="full-width q-mb-xs-md"
                  label="Delete"
                  color="negative"
                  outline
                />
              </div>
            </div>
            <q-btn
              @click="addNewTimeslot()"
              label="Add"
              color="primary"
              outline
            />
          </q-card-section>

          <q-card-section horizontal>
            <q-btn
              id="submit__btn"
              :loading="loading"
              @click="submit()"
              class="q-ml-md"
              label="Submit"
              color="primary"/>
            <q-btn
              v-close-popup
              label="Cancel"
              color="primary"
              flat
              class="q-ml-sm"
          /></q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AdminAttractions",
  components: {},
  props: {
    user: Object
  },
  data() {
    return {
      columns: [
        {
          name: "title",
          label: "Title",
          field: "title",
          align: "left",
          sortable: true
        },
        {
          name: "description",
          label: "Description",
          field: "description",
          align: "left",
          sortable: true
        },
        {
          name: "price",
          label: "Price (€)",
          field: "price",
          align: "left",
          sortable: true
        },
        { name: "status", label: "Status", field: "status", align: "left" },
        { name: "actions", align: "right" }
      ],
      filter: "",
      loading: true,
      showForm: false,
      isEdit: false,
      editItemId: null,
      slotDuration: null,
      showDeleteDialog: false,
      form: {
        title: null,
        price: null,
        description: null,
        time_slots: null,
        max_weight: null,
        min_height: null,
        min_age: null,
        max_customers: null,
        opening_time: null,
        closing_time: null,
        time_slots: []
      }
    };
  },
  methods: {
    ...mapActions([
      "listAttractions",
      "addAttraction",
      "updateAttraction",
      "deleteAttraction"
    ]),
    redirect(user_type) {
      const routes = {
        customer: "/",
        admin: "/admin",
        staff: "/staff"
      };
      this.$router.push(routes[user_type]);
    },
    resetForm() {
      this.form = {
        time_slots: []
      };
    },
    addNewTimeslot() {
      this.form.time_slots.push({ start_time: "", end_time: "" });
    },
    removeTimeslot(index) {
      this.form.time_slots.splice(index, 1);
    },
    getTimeAsNumber(time) {
      time = time.split(":");
      const hours = parseInt(time[0]) * 60;
      const minutes = parseInt(time[1]);
      return hours + minutes;
    },
    getTimeAsString(time) {
      let hours = time / 60;
      hours = (hours + "").split(".");
      let minAsFloat = parseFloat(`0.${hours[1]}`);
      let minutes = 60 * minAsFloat;
      minutes = Math.round(minutes);
      if (minutes == 0) minutes = "00";
      else if (minutes < 10) minutes = "0" + minutes;
      return `${hours[0]}:${minutes}`;
    },
    generateTimeslots() {
      let isGenerating = true;
      let newStartTime = this.getTimeAsNumber(this.form.opening_time);
      let newEndTime =
        this.getTimeAsNumber(this.form.opening_time) +
        parseInt(this.slotDuration);

      while (isGenerating) {
        if (newEndTime >= this.getTimeAsNumber(this.form.closing_time)) {
          newEndTime = this.getTimeAsNumber(this.form.closing_time);
          isGenerating = false;
        }
        let newSlot = {
          start_time: this.getTimeAsString(newStartTime),
          end_time: this.getTimeAsString(newEndTime)
        };
        this.form.time_slots.push(newSlot);

        newStartTime = newEndTime;
        newEndTime = newEndTime + parseInt(this.slotDuration);
      }
      this.slotDuration = null;
      this.showForm = false;
      this.showForm = true;
    },
    initEditForm({
      title,
      price,
      description,
      time_slots,
      max_weight,
      min_height,
      min_age,
      max_customers,
      opening_time,
      closing_time,
      _id
    }) {
      this.form.title = title;
      this.form.price = price;
      this.form.description = description;
      this.form.time_slots = time_slots;
      this.form.max_customers = max_customers;
      this.form.max_weight = max_weight;
      this.form.min_height = min_height;
      this.form.min_age = min_age;
      this.form.opening_time = opening_time;
      this.form.closing_time = closing_time;
      this.editItemId = _id;
      this.isEdit = true;
      this.showForm = true;
    },
    async toggleAttractionStatus(attraction) {
      try {
        await this.updateAttraction({
          id: attraction._id,
          data: {
            status: attraction.status == "open" ? "closed" : "open"
          }
        });
      } catch (error) {}
    },
    async removeItem({ _id }) {
      this.loading = true;
      this.showDeleteDialog = false;
      try {
        await this.deleteAttraction(_id);
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    async submit() {
      this.loading = true;
      try {
        if (this.isEdit)
          await this.updateAttraction({ id: this.editItemId, data: this.form });
        else await this.addAttraction(this.form);
      } catch (error) {
        console.error(error);
      }
      this.showForm = false;
      this.loading = false;
      this.form = {};
      this.editItemId = null;
      this.isEdit = false;
    }
  },
  filters: {
    statusColor(status) {
      const colors = {
        open: "positive",
        closed: "negative",
        full: "accent"
      };
      return colors[status];
    }
  },
  computed: mapGetters(["attractions"]),
  async created() {
    this.$emit("title", "Attractions");
    if (this.user.type !== "admin") this.redirect(this.user.type);

    try {
      await this.listAttractions();
    } catch (error) {
      console.error(error);
    }
    this.loading = false;
  }
};
</script>
